import Tx from 'ethereumjs-tx';

interface IBaseWallet {
  isReadOnly?: boolean;
  getAddressString(): Promise<string> | string;
  getPrivateKeyString?(): string;
}

export interface IReadOnlyWallet extends IBaseWallet {
  isReadOnly: true;
}

export interface IFullWallet extends IBaseWallet {
  isReadOnly?: false;
  signRawTransaction(tx: Tx): Promise<Buffer> | Buffer;
  signMessage(msg: string): Promise<string> | string;
}

export type IWallet = IReadOnlyWallet | IFullWallet;
