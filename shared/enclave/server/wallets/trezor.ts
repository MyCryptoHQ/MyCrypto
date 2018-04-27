import { WalletLib } from 'shared/enclave/types';

const Trezor: WalletLib = {
  async getChainCode() {
    throw new Error('Not yet supported');
  }
};

export default Trezor;
