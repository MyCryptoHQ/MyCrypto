import { PrivKeyWallet } from 'libs/wallet';
import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';

export type TRestoreKeystoreFromWallet = typeof restoreKeystoreFromWallet;
export function restoreKeystoreFromWallet(
  privateKey: Buffer,
  password: string
): interfaces.RestoreKeystoreFromWalletAction {
  return {
    type: TypeKeys.RESTORE_KEYSTORE_INSTANTIATE_WALLET,
    keystoreFile: new PrivKeyWallet(privateKey).toKeystore(password)
  };
}
