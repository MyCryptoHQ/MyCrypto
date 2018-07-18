import { WalletLib } from 'shared/enclave/types';

const SafeT: WalletLib = {
  async getChainCode() {
    throw new Error('Not yet implemented');
  },

  async signTransaction() {
    throw new Error('Not yet implemented');
  },

  async signMessage() {
    throw new Error('Not yet implemented');
  },

  async displayAddress() {
    throw new Error('Not yet implemented');
  }
};

export default SafeT;
