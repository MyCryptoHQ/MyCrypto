import { SagaIterator } from 'redux-saga';
import { put, apply, takeEvery, call } from 'redux-saga/effects';
import { IWalletAndTransaction, signTransactionWrapper } from './helpers';
import {
  signLocalTransactionSucceeded,
  signWeb3TransactionSucceeded,
  TypeKeys
} from 'actions/transaction';
import { computeIndexingHash } from 'libs/transaction';

const signLocalTransaction = signTransactionWrapper(function*({
  tx,
  wallet
}: IWalletAndTransaction): SagaIterator {
  const signedTransaction: Buffer = yield apply(
    wallet,
    wallet.signRawTransaction,
    [tx]
  );
  const indexingHash: string = yield call(
    computeIndexingHash,
    signedTransaction
  );
  yield put(signLocalTransactionSucceeded({ signedTransaction, indexingHash }));
});

const signWeb3Transaction = signTransactionWrapper(function*({
  tx
}: IWalletAndTransaction): SagaIterator {
  const serializedTransaction: Buffer = yield apply(tx, tx.serialize);
  const indexingHash: string = yield call(
    computeIndexingHash,
    serializedTransaction
  );

  yield put(
    signWeb3TransactionSucceeded({
      transaction: serializedTransaction,
      indexingHash
    })
  );
});

export function* signing(): SagaIterator {
  yield [
    takeEvery(TypeKeys.SIGN_LOCAL_TRANSACTION_REQUESTED, signLocalTransaction),
    takeEvery(TypeKeys.SIGN_WEB3_TRANSACTION_REQUESTED, signWeb3Transaction)
  ];
}
