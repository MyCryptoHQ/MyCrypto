import template from './passphrase.html';
import showPrompt from './showPrompt';

const EVENT = 'enclave:passphrase';

export function showPassphrasePrompt(): Promise<string> {
  return showPrompt(template, EVENT);
}
