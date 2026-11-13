import { AccountsError } from './player-rules.js';

export const MIN_AUTOSAVE_MS = 10000;
export const DEFAULT_AUTOSAVE_MS = 30000;

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

// Firestore rejects nested arrays, functions and non-plain values, so fail before the network call.
function findUnstorableValue(value, path) {
  if (typeof value === 'function' || typeof value === 'symbol') return path;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      if (Array.isArray(value[i])) return `${path}[${i}]`;
      const found = findUnstorableValue(value[i], `${path}[${i}]`);
      if (found) return found;
    }
    return null;
  }
  if (isPlainObject(value)) {
    for (const [key, child] of Object.entries(value)) {
      const found = findUnstorableValue(child, `${path}.${key}`);
      if (found) return found;
    }
  }
  return null;
}

export function assertStorableState(state) {
  if (!isPlainObject(state)) {
    throw new AccountsError('invalid-state', 'Saved state must be a plain object.');
  }
  const badPath = findUnstorableValue(state, 'state');
  if (badPath) {
    throw new AccountsError('invalid-state', `${badPath} can't be stored (functions and nested arrays aren't allowed).`);
  }
}

export function resolveNextState(latest, stateOrUpdater) {
  const next = typeof stateOrUpdater === 'function' ? stateOrUpdater(latest) : stateOrUpdater;
  assertStorableState(next);
  return next;
}

export function autosaveIntervalMs(requestedMs = DEFAULT_AUTOSAVE_MS) {
  return Math.max(MIN_AUTOSAVE_MS, requestedMs);
}

export function hasStateChanged(lastSavedJson, state) {
  return JSON.stringify(state) !== lastSavedJson;
}
