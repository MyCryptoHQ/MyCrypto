// @flow
import type { RawTransaction } from 'libs/transaction';

export type IWallet = {
  getAddress: () => Promise<string>,
  signRawTransaction: (_tx: RawTransaction) => Promise<string>
};
