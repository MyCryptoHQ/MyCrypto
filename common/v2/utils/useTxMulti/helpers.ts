import { TxParcel } from './types';

export const getCurrentTxFromTxMulti = (txs: TxParcel[], txi: number) =>
  (txs.length && txs[txi]) || ({} as TxParcel);
