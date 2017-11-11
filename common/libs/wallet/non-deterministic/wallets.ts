import { fromPrivateKey, fromEthSale, fromV3 } from 'ethereumjs-wallet';
import { fromEtherWallet } from 'ethereumjs-wallet/thirdparty';
import { signWrapper } from './helpers';
import { decryptPrivKey } from 'libs/decrypt';

const EncryptedPrivateKeyWallet = (
  encryptedPrivateKey: string,
  password: string
) => signWrapper(fromPrivateKey(decryptPrivKey(encryptedPrivateKey, password)));

const PresaleWallet = (keystore: string, password: string) =>
  signWrapper(fromEthSale(keystore, password));

const MewV1Wallet = (keystore: string, password: string) =>
  signWrapper(fromEtherWallet(keystore, password));

const PrivKeyWallet = (privkey: Buffer) => signWrapper(fromPrivateKey(privkey));

const UtcWallet = (keystore: string, password: string) =>
  signWrapper(fromV3(keystore, password, true));

const AddressOnlyWallet = (address: string) => {
  this.isReadOnly = true;
  this.getAddressString = () => address;
  this.signRawTransaction = () => {
    throw new Error('Wallet is read-only');
  };
  this.signMessage = () => {
    throw new Error('Wallet is read-only');
  };
  this.unlock = () => {
    return Promise.resolve();
  };
};

export {
  EncryptedPrivateKeyWallet,
  PresaleWallet,
  MewV1Wallet,
  PrivKeyWallet,
  UtcWallet,
  AddressOnlyWallet
};
