import { IFullWallet } from 'ethereumjs-wallet';
import { signMessageWithPrivKeyV2, signRawTxWithPrivKey } from 'libs/signing';
import {
  EncryptedPrivateKeyWallet,
  MewV1Wallet,
  PresaleWallet,
  PrivKeyWallet,
  UtcWallet
} from './wallets';
import Tx from 'ethereumjs-tx';

enum KeystoreTypes {
  presale = 'presale',
  utc = 'v2-v3-utc',
  v1Unencrypted = 'v1-unencrypted',
  v1Encrypted = 'v1-encrypted',
  v2Unencrypted = 'v2-unencrypted'
}

interface ISignWrapper {
  signRawTransaction(rawTx: Tx): Buffer;
  signMessage(msg: string): string;
  unlock(): Promise<void>;
}

export type WrappedWallet = IFullWallet & ISignWrapper;

export const signWrapper = (walletToWrap: IFullWallet): WrappedWallet =>
  Object.assign(walletToWrap, {
    signRawTransaction: (t: Tx) => signRawTxWithPrivKey(walletToWrap.getPrivateKey(), t),
    signMessage: (msg: string) => signMessageWithPrivKeyV2(walletToWrap.getPrivateKey(), msg),
    unlock: () => Promise.resolve()
  });

export const determineKeystoreType = (file: string): string => {
  try {
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
      return '';
    }
  } catch {
    return '';
  }
};

export const isKeystoreValid = (file: string): boolean => {
  if (determineKeystoreType(file)) {
    throw new Error('Invalid keystore');
  }
  return !!determineKeystoreType(file);
};

export const isKeystorePassRequired = (file: string): boolean => {
  const keystoreType = determineKeystoreType(file);
  return (
    keystoreType === KeystoreTypes.presale ||
    keystoreType === KeystoreTypes.v1Encrypted ||
    keystoreType === KeystoreTypes.utc
  );
};

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
