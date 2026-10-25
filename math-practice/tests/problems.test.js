const test = require('node:test');
const assert = require('node:assert/strict');
const { loadMathPractice } = require('./load-scripts.js');

const {
  QUESTIONS_PER_SESSION,
  MAX_TRICKY_PER_ROUND,
  buildPrompt,
  correctAnswerFor,
  fillStory,
  levelByAlias,
  makeSession,
  pairFromKey,
  problemKey,
} = loadMathPractice();

const EASY_SUBTRACTION = 'sub-within-10';

function aLevelAlwaysMaking(pair, op = 'add') {
  return { op, make: () => pair };
}

// Its pairs are never tricky-fact keys, so only the tricky facts a session chose can match them.
function aLevelNeverMakingTheSamePairTwice(op) {
  let next = 100;
  return { op, make: () => [next++, 1] };
}

function keysOf(op, pairs) {
  return [...pairs].map(pair => problemKey(op, pair));
}

test('addition keeps the key format every old save used', () => {
  assert.equal(problemKey('add', [7, 5]), '7+5');
});

test('keys round-trip for each operator', () => {
  const facts = [
    ['add', [7, 5], '7+5'],
    ['subtract', [12, 5], '12-5'],
    ['multiply', [3, 7], '3x7'],
    ['divide', [56, 7], '56/7'],
  ];
  for (const [op, pair, key] of facts) {
    assert.equal(problemKey(op, pair), key);
    assert.deepEqual([...pairFromKey(op, key)], pair);
  }
});

test('multiplication is one fact in either order, but the other operators are not', () => {
  assert.equal(problemKey('multiply', [7, 3]), problemKey('multiply', [3, 7]));
  assert.notEqual(problemKey('add', [12, 7]), problemKey('add', [7, 12]));
  assert.notEqual(problemKey('divide', [12, 3]), problemKey('divide', [12, 4]));
});

test('prompts show the operator symbol, or the level\'s own wording', () => {
  assert.equal(buildPrompt(levelByAlias('add-teen-teen'), 12, 17), '12 + 17 =');
  assert.equal(buildPrompt(levelByAlias(EASY_SUBTRACTION), 9, 4), '9 − 4 =');
  assert.equal(buildPrompt(levelByAlias('mul-one-factor-6-to-9'), 7, 8), '7 × 8 =');
  assert.equal(buildPrompt(levelByAlias('div-by-6-to-9'), 56, 7), '56 ÷ 7 =');
  assert.equal(buildPrompt(levelByAlias('add-double-1to10'), 6, 6), 'Double 6');
});

test('answers follow the operator, or the level\'s own answer', () => {
  assert.equal(correctAnswerFor(levelByAlias('add-teen-teen'), 12, 17), 29);
  assert.equal(correctAnswerFor(levelByAlias(EASY_SUBTRACTION), 9, 4), 5);
  assert.equal(correctAnswerFor(levelByAlias('mul-one-factor-6-to-9'), 7, 8), 56);
  assert.equal(correctAnswerFor(levelByAlias('div-by-6-to-9'), 56, 7), 8);
  assert.equal(correctAnswerFor(levelByAlias('bridge-to-ten-1to9'), 3, 7), 7);
});

test('fillStory inserts numbers and agrees singular and plural', () => {
  assert.equal(fillStory('{a:cow|cows} and {b:cow|cows}', { a: 1, b: 3 }), '1 cow and 3 cows');
  assert.equal(fillStory('{a} then {b}', { a: 4, b: 2 }), '4 then 2');
  assert.equal(fillStory('{a:Hinox is|Hinoxes are} here', { a: 1, b: 2 }), '1 Hinox is here');
});

test('a session has a full round of problems', () => {
  const session = makeSession(levelByAlias(EASY_SUBTRACTION), []);
  assert.equal(session.length, QUESTIONS_PER_SESSION);
  assert.equal(new Set(keysOf('subtract', session)).size, QUESTIONS_PER_SESSION);
});

test('tricky facts come back, up to the per-round limit', () => {
  const level = aLevelNeverMakingTheSamePairTwice('subtract');
  const trickyKeys = ['9-4', '7-2', '10-3', '5-1', '8-6', '6-5'];
  const sessionKeys = keysOf('subtract', makeSession(level, trickyKeys));
  const trickyReturned = sessionKeys.filter(key => trickyKeys.includes(key));
  assert.equal(trickyReturned.length, MAX_TRICKY_PER_ROUND);
});

test('a tricky multiplication fact comes back in either order', () => {
  const level = aLevelNeverMakingTheSamePairTwice('multiply');
  const shownOrders = new Set();
  for (let round = 0; round < 100; round++) {
    for (const pair of makeSession(level, ['3x7'])) {
      if (pair.includes(3) && pair.includes(7)) shownOrders.add(pair.join('x'));
    }
  }
  assert.deepEqual([...shownOrders].sort(), ['3x7', '7x3']);
});

test('a level with too few distinct problems still fills the round', () => {
  const session = makeSession(aLevelAlwaysMaking([1, 1]), []);
  assert.equal(session.length, QUESTIONS_PER_SESSION);
});
