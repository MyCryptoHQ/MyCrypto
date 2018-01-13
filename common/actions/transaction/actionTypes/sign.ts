import EthTx from 'ethereumjs-tx';
import { TypeKeys } from 'actions/transaction/constants';

/*
 * Difference between the web3/local is that a local sign will actually sign the tx
 * While a web3 sign just gathers the rest of the nessesary parameters of the ethereum tx
 * to do the sign + broadcast in 1 step later on
 */

/* Signing / Async actions */
interface SignLocalTransactionRequestedAction {
  type: TypeKeys.SIGN_LOCAL_TRANSACTION_REQUESTED;
  payload: EthTx;
}
interface SignLocalTransactionSucceededAction {
  type: TypeKeys.SIGN_LOCAL_TRANSACTION_SUCCEEDED;
  payload: { signedTransaction: Buffer; indexingHash: string; noVerify?: boolean }; // dont verify against fields, for pushTx
}

interface SignWeb3TransactionRequestedAction {
  type: TypeKeys.SIGN_WEB3_TRANSACTION_REQUESTED;
  payload: EthTx;
}
interface SignWeb3TransactionSucceededAction {
  type: TypeKeys.SIGN_WEB3_TRANSACTION_SUCCEEDED;
  payload: { transaction: Buffer; indexingHash: string; noVerify?: boolean };
}
interface SignTransactionFailedAction {
  type: TypeKeys.SIGN_TRANSACTION_FAILED;
}

type SignAction =
  | SignLocalTransactionRequestedAction
  | SignLocalTransactionSucceededAction
  | SignWeb3TransactionRequestedAction
  | SignWeb3TransactionSucceededAction
  | SignTransactionFailedAction;

export {
  SignLocalTransactionRequestedAction,
  SignLocalTransactionSucceededAction,
  SignWeb3TransactionRequestedAction,
  SignWeb3TransactionSucceededAction,
  SignTransactionFailedAction,
  SignAction
};
