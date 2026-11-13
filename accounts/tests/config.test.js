import test from 'node:test';
import assert from 'node:assert/strict';
import { PLAYERS_COLLECTION, decodeFirebaseConfig } from '../config.js';

test('the encoded config decodes to the mlodz-general web config', () => {
  const config = decodeFirebaseConfig();
  assert.equal(config.projectId, 'mlodz-general');
  assert.equal(config.authDomain, 'mlodz-general.firebaseapp.com');
  assert.ok(config.apiKey);
  assert.ok(config.appId);
});

test('players are stored in the players collection', () => {
  assert.equal(PLAYERS_COLLECTION, 'players');
});
