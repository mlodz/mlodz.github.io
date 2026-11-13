import {
  AccountsError,
  assertValidGameId,
  assertValidName,
  assertValidPin,
  displayNameOf,
  playerKeyOf,
} from './player-rules.js';
import { autosaveIntervalMs, hasStateChanged } from './game-state.js';
import { createProfile, fetchProfile, loadGameState, saveGameState, watchGameState } from './store.js';
import { mountSignedInBadge, showSignInModal } from './sign-in-modal.js';

export { AccountsError };

const SESSION_STORAGE_KEY = 'accounts:session:v1';

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY));
  } catch {
    return null;
  }
}

function writeSession(player) {
  try {
    if (player) localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(player));
    else localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Private mode: the player stays signed in for this page load only.
  }
}

export function createAccounts({ gameId }) {
  assertValidGameId(gameId);

  let player = readSession();
  let lastSavedJson = null;
  let pendingSignIn = null;
  const signOutListeners = new Set();
  const sessionListeners = new Set();
  const stopOnSignOut = new Set();

  function setPlayer(nextPlayer) {
    player = nextPlayer;
    writeSession(nextPlayer);
    sessionListeners.forEach(listener => listener());
  }

  function requirePlayer() {
    if (!player) throw new AccountsError('not-signed-in', 'Sign in first.');
    return player;
  }

  function trackUntilSignOut(stop) {
    stopOnSignOut.add(stop);
    return () => {
      stopOnSignOut.delete(stop);
      stop();
    };
  }

  async function signUp(typedName, pin) {
    assertValidName(typedName);
    assertValidPin(pin);
    const displayName = displayNameOf(typedName);
    const name = playerKeyOf(typedName);
    await createProfile(name, displayName, pin);
    setPlayer({ name, displayName });
    return player;
  }

  async function signIn(typedName, pin) {
    assertValidName(typedName);
    assertValidPin(pin);
    const name = playerKeyOf(typedName);
    const profile = await fetchProfile(name);
    if (!profile || profile.pin !== pin) throw new AccountsError('wrong-name-or-pin', 'Wrong name or pin.');
    setPlayer({ name, displayName: profile.displayName });
    return player;
  }

  function requireSignIn() {
    if (player) return Promise.resolve(player);
    pendingSignIn ??= showSignInModal({ signIn, signUp }).finally(() => { pendingSignIn = null; });
    return pendingSignIn;
  }

  function signOut() {
    if (!player) return;
    stopOnSignOut.forEach(stop => stop());
    stopOnSignOut.clear();
    lastSavedJson = null;
    setPlayer(null);
    signOutListeners.forEach(listener => listener());
  }

  async function load() {
    const { name } = requirePlayer();
    const state = await loadGameState(name, gameId);
    lastSavedJson = JSON.stringify(state);
    return state;
  }

  async function save(stateOrUpdater) {
    const { name } = requirePlayer();
    const saved = await saveGameState(name, gameId, stateOrUpdater);
    lastSavedJson = JSON.stringify(saved);
    return saved;
  }

  function autosave(getState, { everyMs, merge } = {}) {
    let inFlight = false;

    async function saveIfChanged() {
      const state = getState();
      if (inFlight || !player || !hasStateChanged(lastSavedJson, state)) return;
      inFlight = true;
      try {
        await save(merge ? latest => merge(latest, state) : state);
      } finally {
        inFlight = false;
      }
    }

    const timerId = setInterval(() => saveIfChanged().catch(console.error), autosaveIntervalMs(everyMs));
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') saveIfChanged().catch(console.error);
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return trackUntilSignOut(() => {
      clearInterval(timerId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    });
  }

  // Fires only for changes this page didn't make itself.
  function onRemoteChange(callback) {
    const { name } = requirePlayer();
    const stopWatching = watchGameState(name, gameId, state => {
      const json = JSON.stringify(state);
      if (json === lastSavedJson) return;
      lastSavedJson = json;
      callback(state);
    });
    return trackUntilSignOut(stopWatching);
  }

  function onSignOut(callback) {
    signOutListeners.add(callback);
    return () => signOutListeners.delete(callback);
  }

  function mountBadge(container) {
    return mountSignedInBadge(container, {
      getPlayer: () => player,
      signOut,
      subscribe: listener => sessionListeners.add(listener),
    });
  }

  // Signing out in another tab of the same game origin signs this one out too.
  window.addEventListener('storage', event => {
    if (event.key === SESSION_STORAGE_KEY && !event.newValue && player) signOut();
  });

  return {
    requireSignIn,
    signUp,
    signIn,
    signOut,
    currentPlayer: () => player,
    onSignOut,
    load,
    save,
    autosave,
    onRemoteChange,
    mountBadge,
  };
}
