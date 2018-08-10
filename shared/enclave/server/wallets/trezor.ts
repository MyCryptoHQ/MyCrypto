import BN from 'bn.js';
import { DeviceList, Session } from 'trezor.js';
import mapValues from 'lodash/mapValues';
import { addHexPrefix } from 'ethereumjs-util';
import EthTx from 'ethereumjs-tx';
import { WalletLib } from 'shared/enclave/types';
import { padLeftEven } from 'libs/values';
import { stripHexPrefixAndLower } from 'libs/formatters';
import { showPinPrompt } from '../views/pin';
import { showPassphrasePrompt } from '../views/passphrase';

const deviceList = new DeviceList({ debug: false });

// Keep session in memory so that we're not constantly re-acquiring
// Null it out if session is grabbed somewhere else first
let currentSession: Session | null;
async function getSession() {
  if (currentSession) {
    return currentSession;
  }

  const { device, session } = await deviceList.acquireFirstDevice(true);
  device.on('disconnect', () => (currentSession = null));
  device.on('changedSessions', (_, isUsedHere) => {
    if (isUsedHere) {
      currentSession = null;
    }
  });
  device.on('pin', (_, cb: (err?: Error, pin?: string) => void) => {
    showPinPrompt()
      .then(pin => {
        cb(undefined, pin);
      })
      .catch(err => {
        console.error('PIN entry failed', err);
        cb(err);
      });
  });
  device.on('passphrase', (cb: (err?: Error, passphrase?: string) => void) => {
    showPassphrasePrompt()
      .then(passphrase => {
        cb(undefined, passphrase);
      })
      .catch(err => {
        console.error('Passphrase entry failed', err);
        cb(err);
      });
  });

  currentSession = session;
  return currentSession;
}

const Trezor: WalletLib = {
  async getChainCode(dpath) {
    const session = await getSession();
    const { message } = await session.getPublicKey(parseHDPath(dpath));

    return {
      chainCode: message.node.chain_code,
      publicKey: message.node.public_key
    };
  },

  async signTransaction(tx, dpath) {
    const { chainId, ...strTx } = tx;
    const cleanedTx = mapValues(mapValues(strTx, stripHexPrefixAndLower), padLeftEven);

    const session = await getSession();
    const res = await session.signEthTx(
      parseHDPath(dpath),
      cleanedTx.nonce,
      cleanedTx.gasPrice,
      cleanedTx.gasLimit,
      cleanedTx.to,
      cleanedTx.value,
      cleanedTx.data,
      chainId
    );

    const signedTx = new EthTx({
      ...strTx,
      v: addHexPrefix(new BN(res.v).toString(16)),
      r: addHexPrefix(res.r.toString()),
      s: addHexPrefix(res.s)
    });
    return {
      signedTransaction: signedTx.serialize().toString('hex')
    };
  },

  async signMessage() {
    throw new Error('Signing is not supported on TREZOR devices');
  },

  async displayAddress(path) {
    const session = await getSession();
    try {
      await session.ethereumGetAddress(parseHDPath(path), true);
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  }
};

// Lifted from https://github.com/trezor/connect/blob/7919d47ca9d483cf303d77907505ccc7d389c68c/popup/src/utils/path.js#L110
// tslint:disable no-bitwise
function parseHDPath(path: string) {
  return path
    .toLowerCase()
    .split('/')
    .filter(p => p !== 'm')
    .map(p => {
      let hardened = false;
      let n = parseInt(p, 10);
      if (p[p.length - 1] === "'") {
        hardened = true;
        p = p.substr(0, p.length - 1);
      }
      if (isNaN(n)) {
        throw new Error('Invalid path specified');
      }
      if (hardened) {
        // hardened index
        n = (n | 0x80000000) >>> 0;
      }
      return n;
    });
}

export default Trezor;
