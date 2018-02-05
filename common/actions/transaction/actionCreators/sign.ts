import {
  SignTransactionFailedAction,
  SignLocalTransactionSucceededAction,
  SignWeb3TransactionSucceededAction,
  SignTransactionRequestedAction
} from '../actionTypes';
import { TypeKeys } from '../constants';

type TSignTransactionFailed = typeof signTransactionFailed;
const signTransactionFailed = (): SignTransactionFailedAction => ({
  type: TypeKeys.SIGN_TRANSACTION_FAILED
});

type TSignTransactionRequested = typeof signTransactionRequested;
const signTransactionRequested = (payload: SignTransactionRequestedAction['payload']) => ({
  type: TypeKeys.SIGN_TRANSACTION_REQUESTED,
  payload
});

type TSignLocalTransactionSucceeded = typeof signLocalTransactionSucceeded;
const signLocalTransactionSucceeded = (
  payload: SignLocalTransactionSucceededAction['payload']
): SignLocalTransactionSucceededAction => ({
  type: TypeKeys.SIGN_LOCAL_TRANSACTION_SUCCEEDED,
  payload
});

type TSignWeb3TransactionSucceeded = typeof signWeb3TransactionSucceeded;
const signWeb3TransactionSucceeded = (
  payload: SignWeb3TransactionSucceededAction['payload']
): SignWeb3TransactionSucceededAction => ({
  type: TypeKeys.SIGN_WEB3_TRANSACTION_SUCCEEDED,
  payload
});

export {
  signTransactionRequested,
  signTransactionFailed,
  signLocalTransactionSucceeded,
  signWeb3TransactionSucceeded,
  TSignLocalTransactionSucceeded,
  TSignWeb3TransactionSucceeded,
  TSignTransactionFailed,
  TSignTransactionRequested
};
