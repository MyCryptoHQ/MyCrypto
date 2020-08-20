import { Transaction as EthTx } from 'ethereumjs-tx';
import { addHexPrefix, toBuffer } from 'ethereumjs-util';
import LedgerTransport from '@ledgerhq/hw-transport';
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid-noevents';
import LedgerEth from '@ledgerhq/hw-app-eth';

import { WalletLib } from 'shared/enclave/types';
import { byContractAddress, TokenInfo } from '@ledgerhq/hw-app-eth/erc20';

let transport: LedgerTransport<string> | null;

async function getEthApp() {
  try {
    if (!transport) {
      transport = await TransportNodeHid.create();
      transport.on('disconnect', () => (transport = null));
    }
    return new LedgerEth(transport);
  } catch (err) {
    if (err && err.name === 'TransportError') {
      throw new Error('ENCLAVE_LEDGER_IN_USE');
    }
    if (err && err.message && err.message.includes('cannot open device with path')) {
      throw new Error('ENCLAVE_LEDGER_IN_USE');
    }
    throw err;
  }
}

const Ledger: WalletLib = {
  async getChainCode(dpath) {
    const app = await getEthApp();
    try {
      const res = await app.getAddress(dpath, false, true);
      return {
        publicKey: res.publicKey,
        chainCode: res.chainCode as string // @todo - figure out the cause of this `string | undefined`
      };
    } catch (err) {
      console.error('Failed to get chain code from ledger:', err);
      throw new Error('ENCLAVE_LEDGER_FAIL');
    }
  },

  async signTransaction(tx, path) {
    const app = await getEthApp();
    // Disable EIP155 in Ethereumjs-tx since it conflicts with Ledger
    const ethTx = new EthTx(
      {
        ...tx,
        v: Buffer.from([tx.chainId]),
        r: toBuffer(0),
        s: toBuffer(0)
      },
      { chain: tx.chainId, hardfork: 'tangerineWhistle' }
    );

    if (ethTx.getChainId() === 1) {
      const tokenInfo = (byContractAddress(ethTx.to.toString('hex')) as unknown) as
        | TokenInfo
        | undefined; // @todo - figure out the cause of this
      if (tokenInfo) {
        await app.provideERC20TokenInformation(tokenInfo);
      }
    }

    const rsv = await app.signTransaction(path, ethTx.serialize().toString('hex'));
    // Disable EIP155 in Ethereumjs-tx since it conflicts with Ledger
    const signedTx = new EthTx(
      {
        ...tx,
        r: addHexPrefix(rsv.r),
        s: addHexPrefix(rsv.s),
        v: addHexPrefix(rsv.v)
      },
      { chain: tx.chainId, hardfork: 'tangerineWhistle' }
    );
    return {
      signedTransaction: signedTx.serialize().toString('hex')
    };
  },

  async signMessage(msg, path) {
    const app = await getEthApp();
    const msgHex = Buffer.from(msg).toString('hex');
    const signed = await app.signPersonalMessage(path, msgHex);
    const combined = addHexPrefix(signed.r + signed.s + signed.v.toString()); // @todo - this toString() should be toString(16)
    return {
      signedMessage: combined
    };
  },

  async displayAddress(path) {
    try {
      const app = await getEthApp();
      await app.getAddress(path, true, false);
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  }
};

export default Ledger;
