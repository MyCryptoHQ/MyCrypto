import { fromPrivateKey } from 'ethereumjs-wallet';

import { signWrapper } from '../helpers';
import { decryptMnemonicToPrivKey } from 'v2/services/EthService';

export const MnemonicWallet = (
  phrase: string,
  pass: string | undefined,
  path: string,
  address: string
) => signWrapper(fromPrivateKey(decryptMnemonicToPrivKey(phrase, pass, path, address)));
