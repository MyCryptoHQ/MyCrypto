import { fromPrivateKey } from 'ethereumjs-wallet';

import { signWrapper } from '../helpers';
import { decryptMnemonicToPrivKey } from '@services/EthService';

export const MnemonicWallet = (
  phrase: string,
  pass: string | undefined,
  path: string,
  address: string
) =>
  Object.assign(
    signWrapper(fromPrivateKey(decryptMnemonicToPrivKey(phrase, pass, path, address))),
    {
      address,
      dPath: path
    }
  );
