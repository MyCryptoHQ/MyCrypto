import { webFrame } from 'electron';
import { PROTOCOL_NAME } from 'shared/enclave/utils';

export function setupClient() {
  webFrame.registerURLSchemeAsPrivileged(PROTOCOL_NAME);
}
