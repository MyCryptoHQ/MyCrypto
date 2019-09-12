import { translateRaw } from 'translations';
import { signWrapper } from '../helpers';
import {
  determineKeystoreType,
  getKeystoreWallet,
  getUtcWallet,
  KeystoreTypes
} from '../non-deterministic';
import { IWallet } from '../IWallet';
import { KeystoreUnlockParams } from './types';

export const unlockKeystore = async (payload: KeystoreUnlockParams) => {
  const { file, password } = payload;
  let wallet: null | IWallet = null;
  try {
    if (determineKeystoreType(file) === KeystoreTypes.utc) {
      wallet = signWrapper(await getUtcWallet(file, password));
    } else {
      wallet = getKeystoreWallet(file, password);
    }
  } catch (e) {
    if (
      password === '' &&
      e.message === 'Private key does not satisfy the curve requirements (ie. it is invalid)'
    ) {
      // tslint:disable-next-line:no-console
      console.log('Error: ' + 'Please Enter a password.');
    } else {
      // tslint:disable-next-line:no-console
      console.log('Error: ' + translateRaw('ERROR_6'));
    }
    return;
  }
  // TODO: provide a more descriptive error than the two 'ERROR_6' (invalid pass) messages above
  return wallet;
};
