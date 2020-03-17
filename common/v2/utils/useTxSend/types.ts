import { ValuesType } from 'utility-types';
import { TransactionResponse } from 'ethers/providers';

import { TUuid, ITxStatus, ITxObject, StoreAccount, TAction } from 'v2/types';

import { default as Reducer } from './reducer';

export type TxSendAction = TAction<ValuesType<typeof Reducer>, any>;
export interface TxSendState {
  readonly _uuid?: TUuid;
  readonly isProcessing: boolean;
  readonly status: ITxStatus;
  readonly account?: StoreAccount;
  readonly txRaw?: ITxObject;
  readonly txHash?: string;
  readonly txReceipt?: TransactionResponse;
}
export interface TxSendActions {
  formatRawTx(txRaw: ITxObject): TxSendState;
  prepareTx(txRaw: ITxObject, account: StoreAccount): Promise<void>;
  sendTx(txHash: string, account: StoreAccount): Promise<void>;
  waitForConfirmation(txHash: string, account: StoreAccount): Promise<void>;
  reset(): Promise<void>;
}
