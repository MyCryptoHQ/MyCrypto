import { fromPrivateKey, fromEthSale, IFullWallet } from 'ethereumjs-wallet';
import { fromEtherWallet } from 'ethereumjs-wallet/thirdparty';

import { decryptPrivKey } from 'libs/decrypt';
import { fromV3 } from 'libs/web-workers';
import { signWrapper, determineKeystoreType, KeystoreTypes } from './helpers';
import Web3Wallet from './web3';
import AddressOnlyWallet from './address';
import ParitySignerWallet from './parity';

const EncryptedPrivateKeyWallet = (encryptedPrivateKey: string, password: string) =>
  signWrapper(fromPrivateKey(decryptPrivKey(encryptedPrivateKey, password)));

const PresaleWallet = (keystore: string, password: string) =>
  signWrapper(fromEthSale(keystore, password));

const MewV1Wallet = (keystore: string, password: string) =>
  signWrapper(fromEtherWallet(keystore, password));

const PrivKeyWallet = (privkey: Buffer) => signWrapper(fromPrivateKey(privkey));

const UtcWallet = (keystore: string, password: string) => fromV3(keystore, password, true);

// Getters
const getUtcWallet = (file: string, password: string): Promise<IFullWallet> => {
  return UtcWallet(file, password);
};

const getPrivKeyWallet = (key: string, password: string) =>
  key.length === 64
    ? PrivKeyWallet(Buffer.from(key, 'hex'))
    : EncryptedPrivateKeyWallet(key, password);

const getKeystoreWallet = (file: string, password: string) => {
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

    default:
      throw Error('Unknown wallet');
  }
};

export {
  EncryptedPrivateKeyWallet,
  PresaleWallet,
  MewV1Wallet,
  PrivKeyWallet,
  UtcWallet,
  Web3Wallet,
  AddressOnlyWallet,
  ParitySignerWallet,
  getUtcWallet,
  getPrivKeyWallet,
  getKeystoreWallet
};
