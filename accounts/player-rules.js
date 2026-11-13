export const MAX_NAME_LENGTH = 19;
export const PIN_LENGTH = 4;

const NAME_PATTERN = /^[\p{L}\p{N}]+( [\p{L}\p{N}]+)*$/u;
const PIN_PATTERN = /^\d{4}$/;
const GAME_ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export class AccountsError extends Error {
  constructor(code, message = code) {
    super(message);
    this.name = 'AccountsError';
    this.code = code;
  }
}

// What the player typed, trimmed and with runs of spaces collapsed. Case is kept for display.
export function displayNameOf(typedName) {
  return String(typedName).trim().replace(/\s+/g, ' ');
}

// The case-insensitive identity used as the Firestore document id.
export function playerKeyOf(typedName) {
  return displayNameOf(typedName).toLowerCase();
}

export function assertValidName(typedName) {
  const displayName = displayNameOf(typedName);
  const isValid = displayName.length > 0
    && displayName.length <= MAX_NAME_LENGTH
    && NAME_PATTERN.test(displayName);
  if (!isValid) {
    throw new AccountsError('invalid-name', `Names are 1-${MAX_NAME_LENGTH} letters, digits and spaces.`);
  }
}

export function assertValidPin(pin) {
  if (!PIN_PATTERN.test(String(pin))) {
    throw new AccountsError('invalid-pin', `A pin is exactly ${PIN_LENGTH} digits.`);
  }
}

export function assertValidGameId(gameId) {
  if (typeof gameId !== 'string' || !GAME_ID_PATTERN.test(gameId)) {
    throw new AccountsError('invalid-game-id', 'gameId must be kebab-case, like "math-game".');
  }
}
