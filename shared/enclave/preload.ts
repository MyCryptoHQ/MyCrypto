import { protocol } from 'electron';
import { PROTOCOL_NAME } from 'shared/enclave/utils';

export function registerProtocol() {
  // Whitelist custom protocol
  protocol.registerSchemesAsPrivileged([
    { scheme: PROTOCOL_NAME, privileges: { standard: true, secure: true } }
  ]);
}
