import { RawTransaction } from 'libs/transaction';

interface IBaseWallet {
  isReadOnly?: boolean;
  getAddressString(): Promise<string> | string;
}

export interface IReadOnlyWallet extends IBaseWallet {
  isReadOnly: true;
}

export interface IFullWallet extends IBaseWallet {
  isReadOnly?: false;
  signRawTransaction(tx: RawTransaction): Promise<string> | string;
  signMessage(msg: string): Promise<string> | string;
}

export type IWallet = IReadOnlyWallet | IFullWallet;
