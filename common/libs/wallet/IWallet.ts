import Tx from 'ethereumjs-tx';

export interface IWallet {
  getAddressString(): Promise<string> | string;
  signRawTransaction(tx: Tx): Promise<Buffer> | Buffer;
  signMessage(msg: string): Promise<string> | string;
}
