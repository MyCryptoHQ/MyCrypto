import {
  SignTransactionFailedAction,
  SignTransactionRequestedAction,
  SignTransactionSucceededAction
} from '../actionTypes';
import { TypeKeys } from '../constants';
export {
  signTransactionFailed,
  signTransactionSucceeded,
  signTransactionRequested,
  TSignTransactionFailed,
  TSignTransactionSucceeded,
  TSignTransactionRequested
};

type TSignTransactionFailed = typeof signTransactionFailed;
const signTransactionFailed = (): SignTransactionFailedAction => ({
  type: TypeKeys.SIGN_TRANSACTION_FAILED
});

type TSignTransactionSucceeded = typeof signTransactionSucceeded;
const signTransactionSucceeded = (
  payload: SignTransactionSucceededAction['payload']
): SignTransactionSucceededAction => ({
  type: TypeKeys.SIGN_TRANSACTION_SUCCEEDED,
  payload
});

type TSignTransactionRequested = typeof signTransactionRequested;
const signTransactionRequested = (
  payload: SignTransactionRequestedAction['payload']
): SignTransactionRequestedAction => ({
  type: TypeKeys.SIGN_TRANSACTION_REQUESTED,
  payload
});
