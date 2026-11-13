import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  initializeFirestore,
  doc,
  getDoc,
  runTransaction,
  onSnapshot,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { decodeFirebaseConfig, PLAYERS_COLLECTION } from './config.js';
import { AccountsError } from './player-rules.js';
import { resolveNextState } from './game-state.js';

let database = null;

function getDatabase() {
  if (!database) {
    const app = initializeApp(decodeFirebaseConfig());
    database = initializeFirestore(app, { ignoreUndefinedProperties: true });
  }
  return database;
}

const profileRef = playerKey => doc(getDatabase(), PLAYERS_COLLECTION, playerKey);
const gameRef = (playerKey, gameId) => doc(getDatabase(), PLAYERS_COLLECTION, playerKey, 'games', gameId);

function asAccountsError(error) {
  if (error instanceof AccountsError) return error;
  if (error?.code === 'unavailable') return new AccountsError('offline', 'Can\'t reach the server.');
  if (error?.code === 'permission-denied') return new AccountsError('permission-denied', 'Firestore rules refused this.');
  return new AccountsError('unknown', error?.message ?? String(error));
}

async function guarded(operation) {
  try {
    return await operation();
  } catch (error) {
    throw asAccountsError(error);
  }
}

export function createProfile(playerKey, displayName, pin) {
  return guarded(() => runTransaction(getDatabase(), async transaction => {
    const ref = profileRef(playerKey);
    if ((await transaction.get(ref)).exists()) throw new AccountsError('name-taken', 'That name is taken.');
    transaction.set(ref, { displayName, pin, createdAt: serverTimestamp() });
  }));
}

export function fetchProfile(playerKey) {
  return guarded(async () => {
    const snapshot = await getDoc(profileRef(playerKey));
    return snapshot.exists() ? snapshot.data() : null;
  });
}

export function loadGameState(playerKey, gameId) {
  return guarded(async () => {
    const snapshot = await getDoc(gameRef(playerKey, gameId));
    return snapshot.exists() ? snapshot.data().data : null;
  });
}

// The updater re-runs if Firestore retries the transaction, so it must be free of side effects.
export function saveGameState(playerKey, gameId, stateOrUpdater) {
  return guarded(() => runTransaction(getDatabase(), async transaction => {
    const ref = gameRef(playerKey, gameId);
    const snapshot = await transaction.get(ref);
    const latest = snapshot.exists() ? snapshot.data().data : null;
    const next = resolveNextState(latest, stateOrUpdater);
    transaction.set(ref, { data: next, updatedAt: serverTimestamp() });
    return next;
  }));
}

export function watchGameState(playerKey, gameId, onChange) {
  return onSnapshot(gameRef(playerKey, gameId), snapshot => {
    onChange(snapshot.exists() ? snapshot.data().data : null);
  });
}
