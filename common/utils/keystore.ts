import { fromPrivateKey, IFullWallet, fromV3 } from 'ethereumjs-wallet';
import { isValidPrivKey } from 'libs/validators';
import { stripHexPrefix } from 'libs/values';
import { makeBlob } from 'utils/blob';
import { N_FACTOR } from 'config/data';

export interface KeystoreFile {
  filename: string;
  blob: string;
}

export function makeKeystoreWalletBlob(wallet: IFullWallet, password: string): string {
  const keystore = wallet.toV3(password, { n: N_FACTOR });
  return makeBlob('text/json;charset=UTF-8', keystore);
}

export function checkKeystoreWallet(
  wallet: IFullWallet,
  privateKey: string,
  password: string
): boolean {
  const keystore = wallet.toV3(password, { n: N_FACTOR });
  const backToWallet = fromV3(keystore, password, true);
  return stripHexPrefix(backToWallet.getPrivateKeyString()) === stripHexPrefix(privateKey);
}

export async function generateKeystoreFileInfo(
  privateKey: string,
  password: string
): Promise<KeystoreFile | null> {
  if (!isValidPrivKey(privateKey)) {
    throw new Error('Invalid private key supplied');
  }

  // Make the wallet from their private key
  const keyBuffer = Buffer.from(stripHexPrefix(privateKey), 'hex');
  const wallet = fromPrivateKey(keyBuffer);

  // Validate the password and keystore generation
  if (!checkKeystoreWallet(wallet, privateKey, password)) {
    throw new Error('Keystore file generation failed, keystore wallet didn’t match private key');
  }

  return {
    filename: wallet.getV3Filename(),
    blob: makeKeystoreWalletBlob(wallet, password)
  };
}
