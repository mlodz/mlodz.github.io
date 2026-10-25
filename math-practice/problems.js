// Problem generation and bookkeeping with no DOM and no saved data, so the tests can run it as is.
// Loaded before levels.js and the page script; everything here is a plain global.

const QUESTIONS_PER_SESSION = 10;
const MAX_TRICKY_PER_ROUND = 4;
const MAX_ANSWER_DIGITS = 3;

function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function nextTen(n) {
  return Math.ceil(n / 10) * 10;
}

// Each generator returns [a, b]; it retries until the pair fits the level's rule.
function pairWhere(pick, fits) {
  for (;;) {
    const [a, b] = pick();
    if (fits(a, b)) return [a, b];
  }
}

function twoDigitNotEndingInZero(min, max) {
  return pairWhere(() => [randInt(min, max), 0], a => a % 10 !== 0)[0];
}

// `symbol` is what she sees. `keySign` is what saved tricky-fact keys use: "+" is how every addition
// fact was saved before subtraction existed, so it must never change.
const OPERATORS = Object.freeze({
  add: Object.freeze({ label: 'Addition', symbol: '+', keySign: '+', answerFor: (a, b) => a + b }),
  subtract: Object.freeze({ label: 'Subtraction', symbol: '−', keySign: '-', answerFor: (a, b) => a - b }),
});

const DEFAULT_OPERATION = 'add';

function problemKey(op, [a, b]) {
  return `${a}${OPERATORS[op].keySign}${b}`;
}

function pairFromKey(op, key) {
  return key.split(OPERATORS[op].keySign).map(Number);
}

// Levels with a `promptFor` (Doubles, Bridge to Ten) word the question their own way.
function buildPrompt(level, a, b) {
  const promptFor = level.promptFor ?? ((x, y) => `${x} ${OPERATORS[level.op].symbol} ${y} =`);
  return promptFor(a, b);
}

// Bridge to Ten asks for the missing partner (b); every other level asks for its operator's result.
function correctAnswerFor(level, a, b) {
  return (level.answerFor ?? OPERATORS[level.op].answerFor)(a, b);
}

function shuffled(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Tricky facts she has missed come back first, then random problems fill the round.
function makeSession(level, trickyKeys) {
  const problems = shuffled(trickyKeys).slice(0, MAX_TRICKY_PER_ROUND).map(key => pairFromKey(level.op, key));
  const seen = new Set(problems.map(pair => problemKey(level.op, pair)));
  for (let attempts = 0; problems.length < QUESTIONS_PER_SESSION; attempts++) {
    const pair = level.make();
    const allowRepeat = attempts > 500; // tiny levels may not have 10 distinct problems
    if (seen.has(problemKey(level.op, pair)) && !allowRepeat) continue;
    seen.add(problemKey(level.op, pair));
    problems.push(pair);
  }
  return shuffled(problems);
}

const STORY_SLOT = /\{([ab])(?::([^|}]*)\|([^}]*))?\}/g;

function fillStory(template, numbers) {
  return template.replace(STORY_SLOT, (_, slot, one, many) => {
    const n = numbers[slot];
    if (one === undefined) return String(n);
    return `${n} ${n === 1 ? one : many}`;
  });
}
