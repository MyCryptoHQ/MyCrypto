import showPrompt from './showPrompt';
import template from './passphrase.html';

const EVENT = 'enclave:passphrase';

export function showPassphrasePrompt(): Promise<string> {
  return showPrompt(template, EVENT);
}
