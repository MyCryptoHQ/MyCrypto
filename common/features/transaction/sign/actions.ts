import * as types from './types';

export type TSignTransactionFailed = typeof signTransactionFailed;
export const signTransactionFailed = (): types.SignTransactionFailedAction => ({
  type: types.TransactionSignActions.SIGN_TRANSACTION_FAILED
});

export type TSignTransactionRequested = typeof signTransactionRequested;
export const signTransactionRequested = (
  payload: types.SignTransactionRequestedAction['payload']
) => ({
  type: types.TransactionSignActions.SIGN_TRANSACTION_REQUESTED,
  payload
});

export type TSignLocalTransactionSucceeded = typeof signLocalTransactionSucceeded;
export const signLocalTransactionSucceeded = (
  payload: types.SignLocalTransactionSucceededAction['payload']
): types.SignLocalTransactionSucceededAction => ({
  type: types.TransactionSignActions.SIGN_LOCAL_TRANSACTION_SUCCEEDED,
  payload
});

export type TSignWeb3TransactionSucceeded = typeof signWeb3TransactionSucceeded;
export const signWeb3TransactionSucceeded = (
  payload: types.SignWeb3TransactionSucceededAction['payload']
): types.SignWeb3TransactionSucceededAction => ({
  type: types.TransactionSignActions.SIGN_WEB3_TRANSACTION_SUCCEEDED,
  payload
});
