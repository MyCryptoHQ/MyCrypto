import { SagaIterator } from 'redux-saga';
import { put, apply, takeEvery, call } from 'redux-saga/effects';
import { IFullWalletAndTransaction, signTransactionWrapper } from './helpers';
import {
  signLocalTransactionSucceeded,
  signWeb3TransactionSucceeded,
  TypeKeys
} from 'actions/transaction';
import { computeIndexingHash } from 'libs/transaction';

export function* signLocalTransactionHandler({
  tx,
  wallet
}: IFullWalletAndTransaction): SagaIterator {
  const signedTransaction: Buffer = yield apply(wallet, wallet.signRawTransaction, [tx]);
  const indexingHash: string = yield call(computeIndexingHash, signedTransaction);
  yield put(signLocalTransactionSucceeded({ signedTransaction, indexingHash }));
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

export const signing = [
  takeEvery(TypeKeys.SIGN_LOCAL_TRANSACTION_REQUESTED, signLocalTransaction),
  takeEvery(TypeKeys.SIGN_WEB3_TRANSACTION_REQUESTED, signWeb3Transaction)
];
