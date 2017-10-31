import { TypeKeys } from './constants';
import { UtcKeystore } from 'libs/keystore';

export interface RestoreKeystoreFromWalletAction {
  type: TypeKeys.RESTORE_KEYSTORE_INSTANTIATE_WALLET;
  keystoreFile: Promise<UtcKeystore>;
}
