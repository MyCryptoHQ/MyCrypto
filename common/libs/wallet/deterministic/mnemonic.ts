import { decryptMnemonicToPrivKey } from 'libs/decrypt';
import Wallet from 'ethereumjs-wallet';
import { signWrapper } from 'libs/wallet';

export const MnemonicWallet = (phrase: string, pass: string, path: string, address: string) =>
  signWrapper(Wallet.fromPrivateKey(decryptMnemonicToPrivKey(phrase, pass, path, address)));
