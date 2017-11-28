import { SagaIterator } from 'redux-saga';
import { put, call, apply, takeEvery } from 'redux-saga/effects';
import {
  getWalletAndTransaction,
  IWalletAndTransaction,
  handleFailedTransaction
} from './helpers';
import {
  SignTransactionRequestedAction,
  signTransactionSucceeded,
  TypeKeys
} from 'actions/transaction';
import { Web3Wallet } from 'libs/wallet';

function* signTransactionLocally({
  tx,
  wallet
}: IWalletAndTransaction): SagaIterator {
  const signedTx: string = yield apply(wallet, wallet.signRawTransaction, [tx]);
  yield put(signTransactionSucceeded(signedTx));
}

function* signTransactionViaWeb3({
  tx,
  wallet
}: IWalletAndTransaction<Web3Wallet>): SagaIterator {
  yield apply(wallet, wallet.sendTransaction, [tx]);
}

function* signTransaction(
  partialTx: SignTransactionRequestedAction
): SagaIterator {
  try {
    const walletAndTx: IWalletAndTransaction = yield call(
      getWalletAndTransaction,
      partialTx.payload
    );
    const isWeb3Wallet = walletAndTx.wallet instanceof Web3Wallet;
    const signingFunc = isWeb3Wallet
      ? signTransactionViaWeb3
      : signTransactionLocally;

    yield call(signingFunc, walletAndTx);
  } catch (err) {
    yield call(handleFailedTransaction, err);
  }
}

export function* signing(): SagaIterator {
  yield [takeEvery(TypeKeys.SIGN_TRANSACTION_REQUESTED, signTransaction)];
}
