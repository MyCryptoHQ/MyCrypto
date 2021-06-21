import { UnsignedTransaction } from '@ethersproject/transactions';

interface IBaseWallet {
  isReadOnly?: boolean;
  getAddress(): string;
  getPrivateKeyString?(): string;
}

export interface IReadOnlyWallet extends IBaseWallet {
  isReadOnly: true;
}

export interface IFullWallet extends IBaseWallet {
  isReadOnly?: false;
  signRawTransaction(tx: UnsignedTransaction): Promise<Buffer> | Buffer;
  signMessage(msg: string): Promise<string> | string;
}

export type IWallet = IReadOnlyWallet | IFullWallet;
