import { RawTransaction } from 'libs/transaction';

export interface IWallet {
  isReadOnly?: boolean;
  getAddressString(): Promise<string> | string;
  signRawTransaction(tx: RawTransaction): Promise<string> | string;
  signMessage(msg: string): Promise<string> | string;
}
