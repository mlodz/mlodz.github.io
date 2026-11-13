import { MAX_NAME_LENGTH, PIN_LENGTH } from './player-rules.js';

const STYLE_ID = 'accounts-modal-style';
const PIN_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'];
const PIN_KEY_LABELS = { clear: 'C', back: '⌫' };

const FRIENDLY_ERRORS = {
  'invalid-name': `Names use letters, numbers and spaces, up to ${MAX_NAME_LENGTH}.`,
  'invalid-pin': `Enter all ${PIN_LENGTH} digits of your pin.`,
  'name-taken': 'Someone already has that name. Try another.',
  'wrong-name-or-pin': 'That name and pin don\'t match.',
  'offline': 'Can\'t reach the server. Check your connection.',
};

const STYLES = `
.acct-overlay { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center;
  padding: 16px; padding-bottom: calc(16px + env(safe-area-inset-bottom)); background: rgba(20, 24, 40, 0.82);
  overflow-y: auto; -webkit-overflow-scrolling: touch; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
.acct-card { width: 100%; max-width: 340px; margin: auto; padding: 20px; border-radius: 18px; background: #fff; color: #222;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35); }
.acct-tabs { display: flex; gap: 8px; margin-bottom: 16px; }
.acct-tab { flex: 1; min-height: 44px; border: 0; border-radius: 12px; background: #e9eaf2; color: #444; font-size: 16px; font-weight: 600; }
.acct-tab[aria-selected="true"] { background: #3454d1; color: #fff; }
.acct-label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 600; color: #555; }
.acct-name { width: 100%; min-height: 48px; padding: 0 12px; border: 2px solid #c9ccdb; border-radius: 12px; font-size: 18px; }
.acct-dots { display: flex; justify-content: center; gap: 14px; margin: 18px 0 12px; }
.acct-dot { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #3454d1; }
.acct-dot[data-filled="true"] { background: #3454d1; }
.acct-pad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.acct-key { min-height: 56px; border: 0; border-radius: 12px; background: #f0f1f7; color: #222; font-size: 22px; font-weight: 600; }
.acct-key:active { background: #d9dcec; }
.acct-error { min-height: 22px; margin: 10px 0 0; font-size: 14px; color: #b3261e; text-align: center; }
.acct-submit { width: 100%; min-height: 52px; margin-top: 6px; border: 0; border-radius: 12px; background: #3454d1; color: #fff; font-size: 18px; font-weight: 700; }
.acct-submit:disabled { opacity: 0.6; }
.acct-badge { display: inline-flex; align-items: center; gap: 8px; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; }
.acct-badge button { min-height: 44px; padding: 0 12px; border: 0; border-radius: 10px; background: rgba(0, 0, 0, 0.12); color: inherit; font-size: 14px; font-weight: 600; }
`;

function installStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = STYLES;
  document.head.appendChild(style);
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function friendlyMessage(error) {
  return FRIENDLY_ERRORS[error.code] ?? 'Something went wrong. Try again.';
}

// Resolves with the signed-in player once `signIn` or `signUp` succeeds; never rejects.
export function showSignInModal({ signIn, signUp }) {
  installStyles();
  return new Promise(resolve => {
    let mode = 'signin';
    let pin = '';
    let busy = false;

    const overlay = element('div', 'acct-overlay');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    const card = element('div', 'acct-card');

    const tabs = element('div', 'acct-tabs');
    tabs.setAttribute('role', 'tablist');
    const signInTab = element('button', 'acct-tab', 'Sign in');
    const signUpTab = element('button', 'acct-tab', 'Sign up');
    for (const tab of [signInTab, signUpTab]) {
      tab.type = 'button';
      tab.setAttribute('role', 'tab');
    }
    tabs.append(signInTab, signUpTab);

    const nameLabel = element('label', 'acct-label', 'Name');
    const nameInput = element('input', 'acct-name');
    nameInput.type = 'text';
    nameInput.maxLength = MAX_NAME_LENGTH;
    nameInput.autocomplete = 'off';
    nameInput.autocapitalize = 'words';
    nameInput.spellcheck = false;
    nameLabel.appendChild(nameInput);

    const dots = element('div', 'acct-dots');
    dots.setAttribute('aria-label', 'Pin');
    const dotNodes = Array.from({ length: PIN_LENGTH }, () => dots.appendChild(element('span', 'acct-dot')));

    const pad = element('div', 'acct-pad');
    const keyNodes = PIN_KEYS.map(key => {
      const button = element('button', 'acct-key', PIN_KEY_LABELS[key] ?? key);
      button.type = 'button';
      button.dataset.key = key;
      return pad.appendChild(button);
    });

    const errorLine = element('p', 'acct-error');
    errorLine.setAttribute('role', 'alert');
    const submit = element('button', 'acct-submit');
    submit.type = 'button';

    card.append(tabs, nameLabel, dots, pad, errorLine, submit);
    overlay.appendChild(card);

    function render() {
      signInTab.setAttribute('aria-selected', String(mode === 'signin'));
      signUpTab.setAttribute('aria-selected', String(mode === 'signup'));
      dotNodes.forEach((dot, index) => { dot.dataset.filled = String(index < pin.length); });
      submit.textContent = mode === 'signin' ? 'Sign in' : 'Create my account';
      submit.disabled = busy;
    }

    function setMode(nextMode) {
      mode = nextMode;
      errorLine.textContent = '';
      render();
    }

    function pressKey(key) {
      if (busy) return;
      errorLine.textContent = '';
      if (key === 'clear') pin = '';
      else if (key === 'back') pin = pin.slice(0, -1);
      else if (pin.length < PIN_LENGTH) pin += key;
      render();
    }

    async function submitForm() {
      if (busy) return;
      busy = true;
      render();
      try {
        const player = await (mode === 'signin' ? signIn : signUp)(nameInput.value, pin);
        overlay.remove();
        resolve(player);
        return;
      } catch (error) {
        errorLine.textContent = friendlyMessage(error);
        if (error.code === 'wrong-name-or-pin' || error.code === 'invalid-pin') pin = '';
      }
      busy = false;
      render();
    }

    signInTab.addEventListener('click', () => setMode('signin'));
    signUpTab.addEventListener('click', () => setMode('signup'));
    keyNodes.forEach(button => button.addEventListener('click', () => pressKey(button.dataset.key)));
    submit.addEventListener('click', submitForm);
    nameInput.addEventListener('keydown', event => { if (event.key === 'Enter') submitForm(); });

    render();
    document.body.appendChild(overlay);
  });
}

export function mountSignedInBadge(container, { getPlayer, signOut, subscribe }) {
  installStyles();
  const badge = element('span', 'acct-badge');
  const label = element('span');
  const signOutButton = element('button', undefined, 'Sign out');
  signOutButton.type = 'button';
  signOutButton.addEventListener('click', signOut);
  badge.append(label, signOutButton);
  container.appendChild(badge);

  function render() {
    const player = getPlayer();
    badge.hidden = !player;
    label.textContent = player ? `Signed in as ${player.displayName}` : '';
  }
  subscribe(render);
  render();
  return () => badge.remove();
}
