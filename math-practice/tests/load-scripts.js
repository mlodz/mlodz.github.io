const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// The app's scripts are plain browser scripts, so they run here in one shared context, the way the
// page loads them. Top-level `const`s don't become context properties, so the names the tests need
// are read back with a single expression.
const SCRIPTS = ['problems.js', 'levels.js'];
const EXPOSED_NAMES = [
  'QUESTIONS_PER_SESSION',
  'MAX_TRICKY_PER_ROUND',
  'MAX_ANSWER_DIGITS',
  'OPERATORS',
  'LEVELS',
  'WINGS_OF_FIRE_STORIES',
  'ZELDA_SUBTRACTION_STORIES',
  'problemKey',
  'pairFromKey',
  'buildPrompt',
  'correctAnswerFor',
  'makeSession',
  'fillStory',
];

function loadMathPractice() {
  const context = vm.createContext({});
  for (const name of SCRIPTS) {
    const source = fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
    vm.runInContext(source, context, { filename: name });
  }
  const app = vm.runInContext(`({ ${EXPOSED_NAMES.join(', ')} })`, context);
  const levelByAlias = alias => app.LEVELS.find(level => level.alias === alias);
  return { ...app, levelByAlias };
}

module.exports = { loadMathPractice };
