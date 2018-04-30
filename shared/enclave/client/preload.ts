import { webFrame } from 'electron';
import { PROTOCOL_NAME } from 'shared/enclave/utils';

export function setupClient() {
  // Whitelist custom protocol
  webFrame.registerURLSchemeAsPrivileged(PROTOCOL_NAME);
}
