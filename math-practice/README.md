# Math Practice

A phone-first quiz app: rounds of 10 questions, stars, medals, stickers. Static files only, no build step. Open `index.html` directly or serve the folder. Progress is saved in the browser's `localStorage` (key `math-practice:v1`), per device.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Page, styles, and everything with a DOM or saved data: screens, stars, medals, stickers, sound, saving |
| `problems.js` | Pure logic: operators, problem keys, session building, prompts, answers, story filling |
| `levels.js` | Data: the levels and their story templates |
| `tests/` | Unit tests for `problems.js` and `levels.js` |
| `hey-kid.html` | Separate page, linked quietly from the home screen |

`problems.js` and `levels.js` are plain classic scripts, loaded in that order before the inline script in `index.html`. Their top-level names are globals. Keep them free of DOM and `localStorage` access so the tests can run them.

## Running the tests

Needs Node (built-in test runner, no `package.json`, no dependencies). From the repo root:

```
node --test 'math-practice/tests/*.test.js'
```

Quote the glob. A directory argument doesn't work on current Node.

`tests/load-scripts.js` runs the two scripts in a Node `vm` context, the way the page loads them, and hands back the names the tests need. A new function or constant you want to test must be added to `EXPOSED_NAMES` there. Arrays made inside the context have a different prototype than the test's own, so spread them (`[...x]`) before `deepEqual`.

## Adding a level

1. Add it to the operator's list in `levels.js` (`ADDITION_LEVELS`, `SUBTRACTION_LEVELS`, `MULTIPLICATION_LEVELS` or `DIVISION_LEVELS`). `make()` returns `[a, b]`; the answer is `a + b`, `a - b`, `a × b` or `a ÷ b` unless the level sets `answerFor`. For division `a` is the dividend, and every generated problem must divide evenly (no remainders). Use `promptFor` to word the question differently, or `stories` for word problems.
2. Give it a new, permanent `alias`. It keys that level's saved stars, medals, rounds, tricky facts and story position. Renaming `name` is fine; changing an `alias` orphans the saved data.
3. Add a rule for it to `LEVEL_RULES` in `tests/levels.test.js`, written independently of the generator. A test fails if a level has no rule, so this can't be skipped.
4. Run the tests.

A new operator goes in the `OPERATORS` table in `problems.js` (its `keySign` becomes part of saved tricky-fact keys, so never change one), plus a `withOperator(...)` group in `LEVELS`. The home screen switcher builds itself from the table. Each operator has four levels: Easy, Medium, Word Problems (Easy and Medium mixed, as stories) and Hard.

## Level design

| | Easy | Medium | Hard |
| --- | --- | --- | --- |
| Addition | sums to 10, doubles, bridge to ten | sums over 10, then teens | tens |
| Subtraction | take away within 10 | teens, crossing ten | 2-digit minus 1 to 10 |
| Multiplication | ×2, ×5, ×10 | ×3, ×4 | one factor 6 to 9, the other 2 to 10 |
| Division | ÷2, ÷5, ÷10 | ÷3, ÷4 | ÷6 to ÷9 |

Times-table facts take the other factor from 1 to 10. Division is built from the multiplication fact, so answers are always whole numbers from 2 to 10. Multiplication treats `3 × 7` and `7 × 3` as one tricky fact (`ignoresOrder` in `OPERATORS`) and shows either order. Addition does not, because its saved keys keep the order they were written in.

## Story templates

`{a}` and `{b}` insert a number. `{a:one|many}` inserts the number followed by `one` when it is 1, `many` otherwise, so verbs that agree go inside: `{a:dragon is|dragons are}`. Every template needs both slots (a test checks). Stories are used in order, and the position is saved per level, so a round she quits still moves on to fresh stories. Subtraction stories must read correctly with `b` less than `a`.

## Saved data: never break old saves

Every save written by an earlier version must keep loading. `loadProgress` merges the saved blob onto defaults, so adding a key or a level is safe. Renaming or removing a key, or changing what one means, is not: bump `schemaVersion` and write a migration. The saved shape is documented above `loadProgress` in `index.html`. Before shipping a change there, load an old save into the new code and check her stars, medals, stickers and history come through.

## Other things worth knowing

- **Tricky facts:** a missed problem is saved as a key (`"7+5"`, `"12-5"`) and comes back in later rounds, up to 4 per round, until it's answered right first try 3 times in a row.
- **Sticker books:** an emoji must never appear in two books, since saves store only the emoji. Each sticker's jingle is derived from the emoji and `JINGLE_SALT`; recheck the salt when adding a book.
- **Testing shortcut:** in the browser console during a round, `cheat(n)` finishes it with `n` of 10 right. It records a real round, so it changes saved progress.
- **Resetting:** clear the site's `localStorage` (or `localStorage.removeItem('math-practice:v1')`).
- **Audio on iOS** only starts from a tap, and the `AudioContext` is rebuilt when the app returns from the background. Don't "simplify" that code without testing on a real device.
- **Confetti** loads from a CDN when the first round starts, and the app works without it.
