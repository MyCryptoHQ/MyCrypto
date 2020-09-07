import { default as Wallet } from 'ethereumjs-wallet';

import { signWrapper } from '../helpers';
import { decryptMnemonicToPrivKey } from '@services/EthService';

export const MnemonicWallet = (
  phrase: string,
  pass: string | undefined,
  path: string,
  address: string
) =>
  Object.assign(
    signWrapper(Wallet.fromPrivateKey(decryptMnemonicToPrivKey(phrase, pass, path, address))),
    {
      address,
      dPath: path
    }
  );
