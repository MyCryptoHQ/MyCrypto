import { SagaIterator } from 'redux-saga';
import { put, apply, takeEvery } from 'redux-saga/effects';
import { IWalletAndTransaction, signTransactionWrapper } from './helpers';
import {
  signLocalTransactionSucceeded,
  signWeb3TransactionSucceeded,
  TypeKeys
} from 'actions/transaction';

const signLocalTransaction = signTransactionWrapper(function*({
  tx,
  wallet
}: IWalletAndTransaction): SagaIterator {
  const signedTx: Buffer = yield apply(wallet, wallet.signRawTransaction, [tx]);
  yield put(signLocalTransactionSucceeded(signedTx));
});

const signWeb3Transaction = signTransactionWrapper(function*({
  tx
}: IWalletAndTransaction): SagaIterator {
  yield put(signWeb3TransactionSucceeded(tx.serialize()));
});

export function* signing(): SagaIterator {
  yield [
    takeEvery(TypeKeys.SIGN_LOCAL_TRANSACTION_REQUESTED, signLocalTransaction),
    takeEvery(TypeKeys.SIGN_WEB3_TRANSACTION_REQUESTED, signWeb3Transaction)
  ];
}
