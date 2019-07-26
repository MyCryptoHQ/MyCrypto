import { fromPrivateKey } from 'ethereumjs-wallet';

import { signWrapper } from 'libs/wallet';
import { decryptMnemonicToPrivKey } from 'v2/services/EthService/utils';

export const MnemonicWallet = (phrase: string, pass: string, path: string, address: string) =>
  signWrapper(fromPrivateKey(decryptMnemonicToPrivKey(phrase, pass, path, address)));
