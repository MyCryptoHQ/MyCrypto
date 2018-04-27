import { WalletLib } from 'shared/enclave/types';

const KeepKey: WalletLib = {
  async getChainCode() {
    throw new Error('Not yet supported');
  }
};

export default KeepKey;
