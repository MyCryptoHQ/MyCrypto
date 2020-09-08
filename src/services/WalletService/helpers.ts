import { default as Wallet } from 'ethereumjs-wallet';
import { Transaction as Tx } from 'ethereumjs-tx';

import { signMessageWithPrivKeyV2, signRawTxWithPrivKey } from '@services/EthService/utils';

interface ISignWrapper {
  signRawTransaction(rawTx: Tx): Buffer;
  signMessage(msg: string): string;
  unlock(): Promise<void>;
}

export type WrappedWallet = Wallet & ISignWrapper;

export const signWrapper = (walletToWrap: Wallet): WrappedWallet =>
  Object.assign(walletToWrap, {
    signRawTransaction: (t: Tx) => signRawTxWithPrivKey(walletToWrap.getPrivateKey(), t),
    signMessage: (msg: string) => signMessageWithPrivKeyV2(walletToWrap.getPrivateKey(), msg),
    getPublicKeyString: () => walletToWrap.getPublicKeyString(),
    unlock: () => Promise.resolve()
  });
