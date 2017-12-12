import {
  SignTransactionFailedAction,
  SignLocalTransactionRequestedAction,
  SignWeb3TransactionRequestedAction,
  SignLocalTransactionSucceededAction,
  SignWeb3TransactionSucceededAction
} from '../actionTypes';
import { TypeKeys } from '../constants';

type TSignTransactionFailed = typeof signTransactionFailed;
const signTransactionFailed = (): SignTransactionFailedAction => ({
  type: TypeKeys.SIGN_TRANSACTION_FAILED
});

type TSignLocalTransactionSucceeded = typeof signLocalTransactionSucceeded;
const signLocalTransactionSucceeded = (
  payload: SignLocalTransactionSucceededAction['payload']
): SignLocalTransactionSucceededAction => ({
  type: TypeKeys.SIGN_LOCAL_TRANSACTION_SUCCEEDED,
  payload
});

type TSignLocalTransactionRequested = typeof signLocalTransactionRequested;
const signLocalTransactionRequested = (
  payload: SignLocalTransactionRequestedAction['payload']
): SignLocalTransactionRequestedAction => ({
  type: TypeKeys.SIGN_LOCAL_TRANSACTION_REQUESTED,
  payload
});

type TSignWeb3TransactionSucceeded = typeof signWeb3TransactionSucceeded;
const signWeb3TransactionSucceeded = (
  payload: SignWeb3TransactionSucceededAction['payload']
): SignWeb3TransactionSucceededAction => ({
  type: TypeKeys.SIGN_WEB3_TRANSACTION_SUCCEEDED,
  payload
});

type TSignWeb3TransactionRequested = typeof signWeb3TransactionRequested;
const signWeb3TransactionRequested = (
  payload: SignWeb3TransactionRequestedAction['payload']
): SignWeb3TransactionRequestedAction => ({
  type: TypeKeys.SIGN_WEB3_TRANSACTION_REQUESTED,
  payload
});

export {
  signTransactionFailed,
  signLocalTransactionSucceeded,
  signLocalTransactionRequested,
  signWeb3TransactionSucceeded,
  signWeb3TransactionRequested,
  TSignLocalTransactionSucceeded,
  TSignLocalTransactionRequested,
  TSignWeb3TransactionSucceeded,
  TSignWeb3TransactionRequested,
  TSignTransactionFailed
};
