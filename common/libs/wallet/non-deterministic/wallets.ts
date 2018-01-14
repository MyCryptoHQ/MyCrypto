import { fromPrivateKey, fromEthSale } from 'ethereumjs-wallet';
import { fromEtherWallet } from 'ethereumjs-wallet/thirdparty';
import { signWrapper } from './helpers';
import { decryptPrivKey } from 'libs/decrypt';
import { fromV3 } from 'libs/web-workers/scrypt-wrapper';
import Web3Wallet from './web3';
import AddressOnlyWallet from './address';

const EncryptedPrivateKeyWallet = (encryptedPrivateKey: string, password: string) =>
  signWrapper(fromPrivateKey(decryptPrivKey(encryptedPrivateKey, password)));

const PresaleWallet = (keystore: string, password: string) =>
  signWrapper(fromEthSale(keystore, password));

const MewV1Wallet = (keystore: string, password: string) =>
  signWrapper(fromEtherWallet(keystore, password));

const PrivKeyWallet = (privkey: Buffer) => signWrapper(fromPrivateKey(privkey));

const UtcWallet = (keystore: string, password: string) => fromV3(keystore, password, true);

export {
  EncryptedPrivateKeyWallet,
  PresaleWallet,
  MewV1Wallet,
  PrivKeyWallet,
  UtcWallet,
  Web3Wallet,
  AddressOnlyWallet
};
