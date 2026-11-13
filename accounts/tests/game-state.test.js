import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_AUTOSAVE_MS,
  MIN_AUTOSAVE_MS,
  assertStorableState,
  autosaveIntervalMs,
  hasStateChanged,
  resolveNextState,
} from '../game-state.js';

function errorCodeFor(state) {
  try {
    assertStorableState(state);
  } catch (error) {
    return error.code;
  }
  return null;
}

test('plain objects with nested objects and flat arrays are storable', () => {
  assert.equal(errorCodeFor({ level: 3, items: ['a', 'b'], stats: { stars: [1, 2] } }), null);
});

test('non-objects, nested arrays and functions are refused', () => {
  assert.equal(errorCodeFor(null), 'invalid-state');
  assert.equal(errorCodeFor([1, 2]), 'invalid-state');
  assert.equal(errorCodeFor({ grid: [[1], [2]] }), 'invalid-state');
  assert.equal(errorCodeFor({ onWin() {} }), 'invalid-state');
});

test('a plain state replaces whatever was saved', () => {
  assert.deepEqual(resolveNextState({ stars: 9 }, { stars: 1 }), { stars: 1 });
});

test('an updater receives the latest saved state, or null the first time', () => {
  const keepBest = latest => ({ stars: Math.max(latest?.stars ?? 0, 5) });
  assert.deepEqual(resolveNextState(null, keepBest), { stars: 5 });
  assert.deepEqual(resolveNextState({ stars: 9 }, keepBest), { stars: 9 });
});

test('an updater returning something unstorable is refused', () => {
  assert.throws(() => resolveNextState({}, () => 'nope'), { code: 'invalid-state' });
});

test('autosave never runs faster than the minimum interval', () => {
  assert.equal(autosaveIntervalMs(), DEFAULT_AUTOSAVE_MS);
  assert.equal(autosaveIntervalMs(1000), MIN_AUTOSAVE_MS);
  assert.equal(autosaveIntervalMs(60000), 60000);
});

test('hasStateChanged compares against the last saved json', () => {
  const saved = JSON.stringify({ stars: 1 });
  assert.equal(hasStateChanged(saved, { stars: 1 }), false);
  assert.equal(hasStateChanged(saved, { stars: 2 }), true);
  assert.equal(hasStateChanged(null, { stars: 1 }), true);
});
