import { default as Wallet } from 'ethereumjs-wallet';

import { decryptMnemonicToPrivKey } from '@utils';

import { signWrapper } from '../helpers';

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
