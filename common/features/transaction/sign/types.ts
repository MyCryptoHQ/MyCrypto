import EthTx from 'ethereumjs-tx';

import { Wei, TokenValue } from 'libs/units';
import { IHexStrTransaction } from 'libs/transaction';

export enum TRANSACTION_SIGN {
  SIGN_TRANSACTION_REQUESTED = 'SIGN_TRANSACTION_REQUESTED',
  SIGN_WEB3_TRANSACTION_SUCCEEDED = 'SIGN_WEB3_TRANSACTION_SUCCEEDED',
  SIGN_LOCAL_TRANSACTION_SUCCEEDED = 'SIGN_LOCAL_TRANSACTION_SUCCEEDED',
  SIGN_TRANSACTION_FAILED = 'SIGN_TRANSACTION_FAILED'
}

export interface SignTransactionRequestedAction {
  type: TRANSACTION_SIGN.SIGN_TRANSACTION_REQUESTED;
  payload: EthTx;
}
export interface SignLocalTransactionSucceededAction {
  type: TRANSACTION_SIGN.SIGN_LOCAL_TRANSACTION_SUCCEEDED;
  payload: { signedTransaction: Buffer; indexingHash: string; noVerify?: boolean }; // dont verify against fields, for pushTx
}

export interface SignWeb3TransactionSucceededAction {
  type: TRANSACTION_SIGN.SIGN_WEB3_TRANSACTION_SUCCEEDED;
  payload: { transaction: Buffer; indexingHash: string; noVerify?: boolean };
}
export interface SignTransactionFailedAction {
  type: TRANSACTION_SIGN.SIGN_TRANSACTION_FAILED;
}

export type SignAction =
  | SignTransactionRequestedAction
  | SignLocalTransactionSucceededAction
  | SignWeb3TransactionSucceededAction
  | SignTransactionFailedAction;

export interface SerializedTxParams extends IHexStrTransaction {
  unit: string;
  currentTo: Buffer;
  currentValue: Wei | TokenValue;
  fee: Wei;
  total: Wei;
  isToken: boolean;
  decimal: number;
}
