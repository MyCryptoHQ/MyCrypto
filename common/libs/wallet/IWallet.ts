import { RawTransaction } from 'libs/transaction';

export interface IWallet {
  getAddress(): Promise<string>;
  signRawTransaction(tx: RawTransaction): Promise<string>;
  signMessage(msg: string): Promise<string>;
}
