import {
  IFullWallet,
  fromPrivateKey,
  fromEthSale,
  fromEtherWallet,
  fromV3
} from 'ethereumjs-wallet';
import { RawTransaction } from 'libs/transaction';
import { signMessageWithPrivKey, signRawTxWithPrivKey } from 'libs/signing';
import { decryptPrivKey } from 'libs/decrypt';

interface ISignWrapper {
  signRawTransaction(rawTx: RawTransaction): string;
  signMessage(msg: string, addresss: string, date: string): string;
  unlock();
}

type WrappedWallet = IFullWallet & ISignWrapper;

const signWrapper = (walletToWrap: IFullWallet): WrappedWallet =>
  Object.assign(walletToWrap, {
    signRawTransaction: (rawTx: RawTransaction) =>
      signRawTxWithPrivKey(walletToWrap.getPrivateKey(), rawTx),
    signMessage: (msg: string, address: string, date: string) =>
      signMessageWithPrivKey(walletToWrap.getPrivateKey(), msg, address, date),
    unlock: () => Promise.resolve()
  });

export const EncryptedPrivateKeyWallet = (
  encryptedPrivateKey: string,
  password: string
) => signWrapper(fromPrivateKey(decryptPrivKey(encryptedPrivateKey, password)));

export const PresaleWallet = (keystore: string, password: string) =>
  signWrapper(fromEthSale(keystore, password));

export const MewV1Wallet = (keystore: string, password: string) =>
  signWrapper(fromEtherWallet(keystore, password));

export const PrivKeyWallet = (privkey: Buffer) =>
  signWrapper(fromPrivateKey(privkey));

export const UtcWallet = (keystore: string, password: string) =>
  signWrapper(fromV3(keystore, password, true));

enum KeystoreTypes {
  presale = 'presale',
  utc = 'v2-v3-utc',
  v1Unencrypted = 'v1-unencrypted',
  v1Encrypted = 'v1-encrypted',
  v2Unencrypted = 'v2-unencrypted'
}

function determineKeystoreType(file: string): string {
  const parsed = JSON.parse(file);
  if (parsed.encseed) {
    return KeystoreTypes.presale;
  } else if (parsed.Crypto || parsed.crypto) {
    return KeystoreTypes.utc;
  } else if (parsed.hash && parsed.locked === true) {
    return KeystoreTypes.v1Encrypted;
  } else if (parsed.hash && parsed.locked === false) {
    return KeystoreTypes.v1Unencrypted;
  } else if (parsed.publisher === 'MyEtherWallet') {
    return KeystoreTypes.v2Unencrypted;
  } else {
    throw new Error('Invalid keystore');
  }
}

export const isKeystorePassRequired = (file: string): boolean =>
  determineKeystoreType(file) === KeystoreTypes.presale ||
  KeystoreTypes.v1Encrypted ||
  KeystoreTypes.utc
    ? true
    : false;

export const getPrivKeyWallet = (key: string, password: string) =>
  key.length === 64
    ? PrivKeyWallet(Buffer.from(key, 'hex'))
    : EncryptedPrivateKeyWallet(key, password);

export const getKeystoreWallet = (file: string, password: string) => {
  const parsed = JSON.parse(file);

  switch (determineKeystoreType(file)) {
    case KeystoreTypes.presale:
      return PresaleWallet(file, password);

    case KeystoreTypes.v1Unencrypted:
      return PrivKeyWallet(Buffer.from(parsed.private, 'hex'));

    case KeystoreTypes.v1Encrypted:
      return MewV1Wallet(file, password);

    case KeystoreTypes.v2Unencrypted:
      return PrivKeyWallet(Buffer.from(parsed.privKey, 'hex'));

    case KeystoreTypes.utc:
      return UtcWallet(file, password);

    default:
      throw Error('Unknown wallet');
  }
};
