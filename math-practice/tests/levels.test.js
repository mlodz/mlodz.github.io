const test = require('node:test');
const assert = require('node:assert/strict');
const { loadMathPractice } = require('./load-scripts.js');

const { LEVELS, OPERATORS, MAX_ANSWER_DIGITS, correctAnswerFor, fillStory, levelByAlias } = loadMathPractice();

const SAMPLES_PER_LEVEL = 1000;
const MIN_STORIES_PER_LEVEL = 40;

const inRange = (n, min, max) => n >= min && n <= max;
const onesDigit = n => n % 10;
const isMultipleOfTen = n => n % 10 === 0;

const isEasySubtraction = (a, b) => inRange(a, 2, 10) && inRange(b, 1, a - 1);
const isCrossTenSubtraction = (a, b) =>
  inRange(a, 11, 18) && inRange(b, 2, 9) && b > onesDigit(a) && a - b < 10;

// A times-table fact: one factor is in `tables`, the other runs 1 to 10, in either order.
const isTableFact = tables => (a, b) =>
  inRange(a, 1, 10) && inRange(b, 1, 10) && (tables.includes(a) || tables.includes(b));
const isEasyMultiplication = isTableFact([2, 5, 10]);
const isMediumMultiplication = isTableFact([3, 4]);
const isHardMultiplication = (a, b) =>
  (inRange(a, 6, 9) && inRange(b, 2, 10)) || (inRange(b, 6, 9) && inRange(a, 2, 10));

// Dividend first: a whole number of divisors, with a quotient from 2 to 10.
const isDivisionBy = divisors => (a, b) => divisors.includes(b) && a % b === 0 && inRange(a / b, 2, 10);
const isEasyDivision = isDivisionBy([2, 5, 10]);
const isMediumDivision = isDivisionBy([3, 4]);

// Each level's rule, restated independently of its generator.
const LEVEL_RULES = {
  'add-1digit-1digit-sum-to-10': (a, b) => inRange(a, 1, 9) && inRange(b, 1, 9) && a + b <= 10,
  'add-double-1to10': (a, b) => inRange(a, 1, 10) && a === b,
  'bridge-to-ten-1to9': (a, b) => inRange(a, 1, 9) && a + b === 10,
  'add-1digit-1digit-sum-over-10': (a, b) => inRange(a, 2, 9) && inRange(b, 2, 9) && a + b > 10,
  'story-wings-of-fire-1digit-1digit': (a, b) => inRange(a, 2, 9) && inRange(b, 2, 9),
  'add-teen-1digit-sum-to-20': (a, b) => inRange(a, 10, 19) && inRange(b, 1, 9) && a + b <= 20,
  'add-teen-1digit-sum-over-20': (a, b) => inRange(a, 12, 19) && inRange(b, 2, 9) && a + b > 20,
  'add-teen-teen': (a, b) => inRange(a, 10, 19) && inRange(b, 10, 19),
  'add-2digit-1digit-make-next-ten': (a, b) =>
    inRange(a, 11, 99) && !isMultipleOfTen(a) && inRange(b, 1, 9) && isMultipleOfTen(a + b),
  'add-2digit-2digit-make-ten': (a, b) =>
    inRange(a, 11, 89) && !isMultipleOfTen(a) && onesDigit(a) + onesDigit(b) === 10 && a + b <= 100,
  'sub-within-10': isEasySubtraction,
  'sub-teen-1digit-cross-ten': isCrossTenSubtraction,
  'story-zelda-totk-subtraction': (a, b) => isEasySubtraction(a, b) || isCrossTenSubtraction(a, b),
  'sub-2digit-up-to-10': (a, b) => inRange(a, 21, 99) && inRange(b, 1, 10),
  'mul-tables-2-5-10': isEasyMultiplication,
  'mul-tables-3-4': isMediumMultiplication,
  'story-wings-totk-multiplication': (a, b) => isEasyMultiplication(a, b) || isMediumMultiplication(a, b),
  'mul-one-factor-6-to-9': isHardMultiplication,
  'div-by-2-5-10': isEasyDivision,
  'div-by-3-4': isMediumDivision,
  'story-wings-totk-division': (a, b) => isEasyDivision(a, b) || isMediumDivision(a, b),
  'div-by-6-to-9': isDivisionBy([6, 7, 8, 9]),
};

function samplesFrom(level) {
  return Array.from({ length: SAMPLES_PER_LEVEL }, () => level.make());
}

test('every level has a rule here, and every rule has a level', () => {
  const aliases = [...LEVELS].map(level => level.alias).sort();
  assert.deepEqual(aliases, Object.keys(LEVEL_RULES).sort());
});

test('level aliases are unique and every level has a known operator', () => {
  const aliases = LEVELS.map(level => level.alias);
  assert.equal(new Set(aliases).size, aliases.length);
  for (const level of LEVELS) assert.ok(level.op in OPERATORS, `${level.alias} has op ${level.op}`);
});

for (const level of LEVELS) {
  test(`${level.alias} only makes problems that fit its rule`, () => {
    const fits = LEVEL_RULES[level.alias];
    for (const [a, b] of samplesFrom(level)) {
      assert.ok(fits(a, b), `${a}, ${b} breaks the rule`);
      const answer = correctAnswerFor(level, a, b);
      assert.ok(Number.isInteger(answer) && answer >= 1, `${a}, ${b} answers ${answer}`);
      assert.ok(String(answer).length <= MAX_ANSWER_DIGITS, `${answer} does not fit the keypad`);
    }
  });
}

test('Word Problems subtraction mixes easy and cross-ten problems', () => {
  const samples = samplesFrom(levelByAlias('story-zelda-totk-subtraction'));
  assert.ok(samples.some(([a, b]) => isEasySubtraction(a, b)));
  assert.ok(samples.some(([a, b]) => isCrossTenSubtraction(a, b)));
});

for (const level of LEVELS.filter(level => level.stories)) {
  test(`${level.alias} stories each have both number slots and fill cleanly`, () => {
    for (const story of level.stories) {
      assert.match(story, /\{a[:}]/, `no {a} in: ${story}`);
      assert.match(story, /\{b[:}]/, `no {b} in: ${story}`);
      for (const numbers of [{ a: 1, b: 1 }, { a: 7, b: 3 }]) {
        assert.doesNotMatch(fillStory(story, numbers), /[{}|]/, `unfilled slot in: ${story}`);
      }
    }
  });
}

for (const level of LEVELS.filter(level => level.stories)) {
  test(`${level.alias} has enough stories, none repeated`, () => {
    const stories = [...level.stories];
    assert.ok(stories.length >= MIN_STORIES_PER_LEVEL);
    assert.equal(new Set(stories).size, stories.length);
  });
}

test('Word Problems for multiplication and division mix easy and medium problems', () => {
  for (const [alias, isEasy, isMedium] of [
    ['story-wings-totk-multiplication', isEasyMultiplication, isMediumMultiplication],
    ['story-wings-totk-division', isEasyDivision, isMediumDivision],
  ]) {
    const samples = samplesFrom(levelByAlias(alias));
    assert.ok(samples.some(([a, b]) => isMedium(a, b) && !isEasy(a, b)), `${alias} never made a medium-only problem`);
    assert.ok(samples.some(([a, b]) => isEasy(a, b)), `${alias} never made an easy problem`);
  }
});

test('multiplication shows its factors in both orders', () => {
  for (const alias of ['mul-tables-2-5-10', 'mul-tables-3-4', 'mul-one-factor-6-to-9']) {
    const samples = samplesFrom(levelByAlias(alias));
    assert.ok(samples.some(([a, b]) => a < b), `${alias} never made a smaller factor first`);
    assert.ok(samples.some(([a, b]) => a > b), `${alias} never made a larger factor first`);
  }
});
