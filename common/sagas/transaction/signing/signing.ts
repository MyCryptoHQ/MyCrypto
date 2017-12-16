import { SagaIterator } from 'redux-saga';
import { put, apply, takeEvery, call, select } from 'redux-saga/effects';
import { IFullWalletAndTransaction, signTransactionWrapper } from './helpers';
import {
  signLocalTransactionSucceeded,
  signWeb3TransactionSucceeded,
  TypeKeys,
  reset,
  SignWeb3TransactionSucceededAction,
  SignLocalTransactionSucceededAction
} from 'actions/transaction';
import { computeIndexingHash } from 'libs/transaction';
import { serializedAndTransactionFieldsMatch } from 'selectors/transaction';
import { showNotification } from 'actions/notifications';

export function* signLocalTransactionHandler({
  tx,
  wallet
}: IFullWalletAndTransaction): SagaIterator {
  const signedTransaction: Buffer = yield apply(wallet, wallet.signRawTransaction, [tx]);
  const indexingHash: string = yield call(computeIndexingHash, signedTransaction);
  yield put(signLocalTransactionSucceeded({ signedTransaction, indexingHash, noVerify: false }));
}

const signLocalTransaction = signTransactionWrapper(signLocalTransactionHandler);

export function* signWeb3TransactionHandler({ tx }: IFullWalletAndTransaction): SagaIterator {
  const serializedTransaction: Buffer = yield apply(tx, tx.serialize);
  const indexingHash: string = yield call(computeIndexingHash, serializedTransaction);

  yield put(
    signWeb3TransactionSucceeded({
      transaction: serializedTransaction,
      indexingHash
    })
  );
}

const signWeb3Transaction = signTransactionWrapper(signWeb3TransactionHandler);

/**
 * @description Verifies that the transaction matches the fields, and if its a locally signed transaction (so it has a signature) it will verify the signature too
 * @param {(SignWeb3TransactionSucceededAction | SignLocalTransactionSucceededAction)} {
 *   type
 * }
 * @returns {SagaIterator}
 */
function* verifyTransaction({
  type,
  payload: { noVerify }
}: SignWeb3TransactionSucceededAction | SignLocalTransactionSucceededAction): SagaIterator {
  if (noVerify) {
    return;
  }
  const transactionsMatch: boolean = yield select(
    serializedAndTransactionFieldsMatch,
    type === TypeKeys.SIGN_LOCAL_TRANSACTION_SUCCEEDED,
    noVerify
  );
  if (!transactionsMatch) {
    yield put(
      showNotification('danger', 'Something went wrong signing your transaction, please try again')
    );
    yield put(reset());
  }
}
export const signing = [
  takeEvery(TypeKeys.SIGN_LOCAL_TRANSACTION_REQUESTED, signLocalTransaction),
  takeEvery(TypeKeys.SIGN_WEB3_TRANSACTION_REQUESTED, signWeb3Transaction),
  takeEvery(
    [TypeKeys.SIGN_LOCAL_TRANSACTION_SUCCEEDED, TypeKeys.SIGN_WEB3_TRANSACTION_SUCCEEDED],
    verifyTransaction
  )
];
