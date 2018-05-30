import { WalletLib } from 'shared/enclave/types';
import { DeviceList } from 'trezor.js';
const deviceList = new DeviceList({ debug: true });

// Converts m/44'/60'/0'/0 to [44, 60, 0, 0]
function pathToArray(path: string): number[] {
  return path
    .toLowerCase()
    .replace('m', '')
    .replace("'", '')
    .split('/')
    .map(n => parseInt(n, 10));
}

const Trezor: WalletLib = {
  async getChainCode(dpath) {
    console.log(deviceList.transport);
    const { session } = await deviceList.acquireFirstDevice(true);
    const { message } = await session.getPublicKey(pathToArray(dpath), 'ETH');

    return {
      chainCode: message.node.chain_code,
      publicKey: message.node.public_key
    };
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

export default Trezor;
