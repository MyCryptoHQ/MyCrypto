import type { RawTransaction } from 'libs/transaction';

export interface IWallet {
  getAddress: () => Promise<string>,
  signRawTransaction: (_tx: RawTransaction) => Promise<string>
}
