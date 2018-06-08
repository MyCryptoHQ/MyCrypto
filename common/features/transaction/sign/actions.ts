import { TypeKeys } from '../types';
import {
  SignTransactionFailedAction,
  SignLocalTransactionSucceededAction,
  SignWeb3TransactionSucceededAction,
  SignTransactionRequestedAction
} from './types';

export type TSignTransactionFailed = typeof signTransactionFailed;
export const signTransactionFailed = (): SignTransactionFailedAction => ({
  type: TypeKeys.SIGN_TRANSACTION_FAILED
});

export type TSignTransactionRequested = typeof signTransactionRequested;
export const signTransactionRequested = (payload: SignTransactionRequestedAction['payload']) => ({
  type: TypeKeys.SIGN_TRANSACTION_REQUESTED,
  payload
});

export type TSignLocalTransactionSucceeded = typeof signLocalTransactionSucceeded;
export const signLocalTransactionSucceeded = (
  payload: SignLocalTransactionSucceededAction['payload']
): SignLocalTransactionSucceededAction => ({
  type: TypeKeys.SIGN_LOCAL_TRANSACTION_SUCCEEDED,
  payload
});

export type TSignWeb3TransactionSucceeded = typeof signWeb3TransactionSucceeded;
export const signWeb3TransactionSucceeded = (
  payload: SignWeb3TransactionSucceededAction['payload']
): SignWeb3TransactionSucceededAction => ({
  type: TypeKeys.SIGN_WEB3_TRANSACTION_SUCCEEDED,
  payload
});
