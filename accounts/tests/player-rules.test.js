import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AccountsError,
  MAX_NAME_LENGTH,
  assertValidGameId,
  assertValidName,
  assertValidPin,
  displayNameOf,
  playerKeyOf,
} from '../player-rules.js';

function codeThrownBy(action) {
  try {
    action();
  } catch (error) {
    assert.ok(error instanceof AccountsError);
    return error.code;
  }
  return null;
}

test('playerKeyOf ignores case, outer spaces and repeated spaces', () => {
  assert.equal(playerKeyOf('  Bob  The   Builder '), 'bob the builder');
  assert.equal(playerKeyOf('STEVE'), playerKeyOf('steve'));
});

test('displayNameOf keeps the typed case', () => {
  assert.equal(displayNameOf('  Bob  Smith '), 'Bob Smith');
});

test('names of 1 to 19 letters, digits and spaces are accepted', () => {
  assert.equal(codeThrownBy(() => assertValidName('B')), null);
  assert.equal(codeThrownBy(() => assertValidName('Bob 2')), null);
  assert.equal(codeThrownBy(() => assertValidName('Zoë')), null);
  assert.equal(codeThrownBy(() => assertValidName('a'.repeat(MAX_NAME_LENGTH))), null);
});

test('names that are empty, too long or use symbols are rejected', () => {
  assert.equal(codeThrownBy(() => assertValidName('   ')), 'invalid-name');
  assert.equal(codeThrownBy(() => assertValidName('a'.repeat(MAX_NAME_LENGTH + 1))), 'invalid-name');
  assert.equal(codeThrownBy(() => assertValidName('bob/../x')), 'invalid-name');
  assert.equal(codeThrownBy(() => assertValidName('b@b')), 'invalid-name');
});

test('a pin is exactly four digits', () => {
  assert.equal(codeThrownBy(() => assertValidPin('1234')), null);
  assert.equal(codeThrownBy(() => assertValidPin('0000')), null);
  assert.equal(codeThrownBy(() => assertValidPin('123')), 'invalid-pin');
  assert.equal(codeThrownBy(() => assertValidPin('12345')), 'invalid-pin');
  assert.equal(codeThrownBy(() => assertValidPin('12a4')), 'invalid-pin');
  assert.equal(codeThrownBy(() => assertValidPin('')), 'invalid-pin');
});

test('a game id is kebab-case', () => {
  assert.equal(codeThrownBy(() => assertValidGameId('math-game')), null);
  assert.equal(codeThrownBy(() => assertValidGameId('talkie2')), null);
  assert.equal(codeThrownBy(() => assertValidGameId('Math Game')), 'invalid-game-id');
  assert.equal(codeThrownBy(() => assertValidGameId('a/b')), 'invalid-game-id');
  assert.equal(codeThrownBy(() => assertValidGameId(undefined)), 'invalid-game-id');
});
