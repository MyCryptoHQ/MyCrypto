import { webFrame } from 'electron';
import { PROTOCOL_NAME } from 'shared/enclave/utils';

export function registerProtocol() {
  // Whitelist custom protocol
  webFrame.registerURLSchemeAsPrivileged(PROTOCOL_NAME);
}
