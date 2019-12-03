import { IFullWallet } from 'ethereumjs-wallet';
import { makeBlob } from 'utils/blob';
import { N_FACTOR } from 'config';

export interface KeystoreFile {
  filename: string;
  blob: string;
}

export function makeKeystoreWalletBlob(wallet: IFullWallet, password: string): string {
  const keystore = wallet.toV3(password, { n: N_FACTOR });
  return makeBlob('text/json;charset=UTF-8', keystore);
}
