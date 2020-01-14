import { registerProtocol } from 'shared/enclave/preload';

process.once('loaded', () => {
  registerProtocol();
});
