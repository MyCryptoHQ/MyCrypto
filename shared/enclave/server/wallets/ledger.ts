import { WalletLib } from 'shared/enclave/types';
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import LedgerEth from '@ledgerhq/hw-app-eth';

async function getEthApp() {
  const transport = await TransportNodeHid.create();
  return new LedgerEth(transport);
}

const Ledger: WalletLib = {
  async getChainCode(dpath: string) {
    const app = await getEthApp();
    try {
      const res = await app.getAddress(dpath);
      console.log(res);
      return {
        publicKey: res.publicKey,
        chainCode: res.chainCode
      };
    } catch (err) {
      console.log('wtf', err);
      throw new Error('test');
    }
  }
};

export default Ledger;
