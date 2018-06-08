import EthTx from 'ethereumjs-tx';

import { Wei, TokenValue } from 'libs/units';
import { IHexStrTransaction } from 'libs/transaction';
import { TypeKeys } from '../types';

export interface SignTransactionRequestedAction {
  type: TypeKeys.SIGN_TRANSACTION_REQUESTED;
  payload: EthTx;
}
export interface SignLocalTransactionSucceededAction {
  type: TypeKeys.SIGN_LOCAL_TRANSACTION_SUCCEEDED;
  payload: { signedTransaction: Buffer; indexingHash: string; noVerify?: boolean }; // dont verify against fields, for pushTx
}

export interface SignWeb3TransactionSucceededAction {
  type: TypeKeys.SIGN_WEB3_TRANSACTION_SUCCEEDED;
  payload: { transaction: Buffer; indexingHash: string; noVerify?: boolean };
}
export interface SignTransactionFailedAction {
  type: TypeKeys.SIGN_TRANSACTION_FAILED;
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
