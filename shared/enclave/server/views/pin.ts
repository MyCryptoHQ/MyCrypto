import template from './pin.html';
import showPrompt from './showPrompt';

const EVENT = 'enclave:pin';

export function showPinPrompt(): Promise<string> {
  return showPrompt(template, EVENT);
}
