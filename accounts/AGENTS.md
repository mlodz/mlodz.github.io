# accounts/ — shared player accounts for every game

One name + 4-digit pin works across all games. Progress is saved per player, per game, in Firestore (project `mlodz-general`, `(default)` database, `players` collection). There is deliberately **no real auth**: this is for family and kids, so a name and pin are the only gate. Don't add Firebase Auth, emails, or passwords.

## Using it from a game

Import by absolute URL so it works from `mlodz.github.io` and from games on `mlodzianoski.com`. Never copy these files into a game and never import them with a relative `../accounts/` path.

```js
import { createAccounts } from 'https://mlodz.github.io/accounts/accounts.js';

const accounts = createAccounts({ gameId: 'math-game' }); // kebab-case, unique per game, never changes
await accounts.requireSignIn();                           // shows the sign in / sign up modal if needed
const state = (await accounts.load()) ?? newGameState();  // null the first time
startGame(state);
accounts.autosave(() => state);                           // see "Saving" below
accounts.mountBadge(document.querySelector('#who'));      // "Signed in as Bob · Sign out"
accounts.onSignOut(() => location.reload());              // reset the game's UI on sign out
```

| Call | Returns / does |
| --- | --- |
| `requireSignIn()` | `{ name, displayName }`. Resolves at once if already signed in, else shows the modal. |
| `signUp(name, pin)` / `signIn(name, pin)` | Same result, for games drawing their own screens. |
| `currentPlayer()` | `{ name, displayName }` or `null`. Synchronous. |
| `signOut()` | Clears the session, stops autosave and remote watchers, fires `onSignOut` callbacks. |
| `load()` | This game's saved state, or `null`. |
| `save(state)` | Overwrites this game's state. |
| `save(latest => next)` | Transactional merge against the newest server state (see below). |
| `autosave(getState, { everyMs, merge })` | Saves on a timer and when the tab is hidden. Returns a stop function. |
| `onRemoteChange(callback)` | Fires when another device or tab saved this game. Returns an unsubscribe function. |
| `mountBadge(element)` | Signed-in chip with a 44px Sign out button. |

Errors are `AccountsError` with a `code`: `invalid-name`, `invalid-pin`, `name-taken`, `wrong-name-or-pin`, `offline`, `permission-denied`, `invalid-state`, `invalid-game-id`, `not-signed-in`, `unknown`. The modal already shows friendly messages for the first five.

Names are 1–19 letters, digits and spaces. Case is ignored for sign in but the typed case is kept for display. Name and pin can't be changed after sign up.

## Saving without clobbering

- A game only ever writes `players/{name}/games/{gameId}`, so one game can't overwrite another's progress. Keep `gameId` stable, because changing it orphans everyone's saves.
- Two devices can have the same game open. Never blindly overwrite progress with an older copy. Use a merge so stale state can't move progress backwards:

```js
await accounts.save(latest => ({
  stars: Math.max(latest?.stars ?? 0, localStars),
  levelsUnlocked: Math.max(latest?.levelsUnlocked ?? 1, localLevels),
  found: [...new Set([...(latest?.found ?? []), ...localFound])],
}));
```

- The updater runs inside a transaction and may run more than once. Keep it pure: no DOM, no network, no randomness.
- With `autosave`, pass `merge: (latest, mine) => next` for the same protection. Without `merge` it overwrites.
- Saved state must be a plain object. No functions, no `undefined`, and **no arrays directly inside arrays** (Firestore rejects them; use an array of objects like `[{ cells: [...] }]`). `save` throws `invalid-state` early if you break this.

## Staying inside the Firebase free tier (Spark plan)

Firestore's free quotas (checked against [Firebase pricing](https://firebase.google.com/pricing) via [CostBench](https://www.costbench.com/software/database-as-service/firestore/); re-check the pricing page, since they can change):

| Quota | Free per project |
| --- | --- |
| Stored data | 1 GiB |
| Document reads | 50,000 / day |
| Document writes | 20,000 / day |
| Document deletes | 20,000 / day |
| Network egress | 10 GiB / month |

Quotas are per project, not per game or per kid, so every game shares the same budget. Batched writes don't save anything: each operation in a batch counts. Over quota, requests fail until the next day; with no billing account attached nothing is ever charged.

What not to do:

- **Don't save on every tap, frame or keystroke.** Save on meaningful events (level finished, item collected) or use `autosave`. It skips unchanged state and refuses intervals under 10 seconds; the default is 30 seconds. Each `save` costs 1 read and 1 write.
- **Don't poll.** Never call `load()` in a timer. Use `onRemoteChange` if you need live updates, or load once at start.
- **Don't add more `onRemoteChange` listeners than needed.** One per game page; each delivered change costs a read.
- **Don't store big or ever-growing state.** A document is capped near 1 MiB (general Firestore limit). Don't append a history log into the state doc; keep totals, bests and sets instead.
- **Don't write to one document faster than about once a second** (Firestore guidance from general knowledge, not verified in this research). Another reason to avoid per-tap saves.
- **Don't scan collections.** `accounts.js` only reads single documents on purpose. Don't add queries or listeners over `players` or `games`; they bill one read per document returned.
- **Don't add Firestore rules that call `get()` or `exists()`.** Each one counts as an extra document read on every request.
- **Don't write loops that retry failed saves immediately.** Back off or wait for the next autosave.
- **Don't leave the database in test mode.** Test-mode rules expire after 30 days and then every request is denied. `firestore.rules` here has no expiry.
- **Don't use Cloud Functions, Storage uploads or other Firebase products** from games without checking the Spark plan first; Cloud Functions require the paid plan.

## Files

| File | Job |
| --- | --- |
| `accounts.js` | Public API (`createAccounts`), session in `localStorage`, autosave, remote-change filtering |
| `player-rules.js` | Pure: name/pin/gameId validation, `AccountsError` |
| `game-state.js` | Pure: state validation, updater resolution, autosave interval and change detection |
| `store.js` | The only file that talks to Firestore |
| `sign-in-modal.js` | Sign in / sign up modal with a numeric pin pad, and the signed-in badge |
| `config.js` | Lightly encoded Firebase web config and the collection name |
| `firestore.rules` | Rules to paste into the console for the `(default)` database |
| `index.html` | Demo page: a synced counter |
| `tests/` | Unit tests for the pure modules |

```
node --test 'accounts/tests/*.test.js'
```

Keep `player-rules.js`, `game-state.js` and `config.js` free of DOM and Firebase imports so tests can run them in Node.

## One-time setup (for the site owner)

1. In the Firebase console, paste `firestore.rules` into the `(default)` Firestore database's Rules tab and publish.
2. In Google Cloud Console > APIs & Services > Credentials, restrict the web API key to the HTTP referrers `https://mlodz.github.io/*` and `https://*.mlodzianoski.com/*` (add `http://localhost:*` while developing).
3. Keep the project on the Spark plan with no billing account, and don't commit the root `firebase.config` (it's in `.gitignore`).

## Gotchas

- Browsers block ES modules on `file://`, so a page that imports `accounts.js` can't be previewed by double-clicking it. Run `python3 -m http.server 8000` from the repo root and open `http://localhost:8000/...`, with `http://localhost:*` allowed on the API key.

- The Firebase web config is not a secret; it has to reach the browser. `config.js` only encodes it so grep and key scanners don't flag it. Protection comes from the key restriction above, the rules, and the Spark plan.
- Pins are stored in plain text and the profile is readable by anyone, on purpose. Never reuse a real password as a pin.
- Anyone who knows a name can try its 10,000 pins; there's no lockout.
- Session lives in `localStorage` per origin, so a game on `mlodzianoski.com` asks for a sign in separately from one on `mlodz.github.io`.
