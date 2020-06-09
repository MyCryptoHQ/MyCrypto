import { translateRaw } from '@translations';
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
      return translateRaw('MISSING_PASSWORD');
    } else {
      return translateRaw('ERROR_6');
    }
  }
  // @todo: provide a more descriptive error than the two 'ERROR_6' (invalid pass) messages above
  return wallet;
};
