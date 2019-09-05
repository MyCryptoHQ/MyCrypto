import { fromPrivateKey } from 'ethereumjs-wallet';

import { decryptMnemonicToPrivKey, signWrapper } from 'v2/services/EthService';

export const MnemonicWallet = (
  phrase: string,
  pass: string | undefined,
  path: string,
  address: string
) => signWrapper(fromPrivateKey(decryptMnemonicToPrivKey(phrase, pass, path, address)));
