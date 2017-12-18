import { getWalletInst } from 'selectors/wallet';
import { IFullWallet } from 'libs/wallet';
import { getNetworkConfig } from 'selectors/config';
import { select, call, put, take } from 'redux-saga/effects';
import {
  signTransactionFailed,
  SignWeb3TransactionRequestedAction,
  SignLocalTransactionRequestedAction,
  GetFromFailedAction,
  GetFromSucceededAction,
  getFromRequested,
  TypeKeys as TK
} from 'actions/transaction';
import Tx from 'ethereumjs-tx';
import { NetworkConfig } from 'config/data';
import { SagaIterator } from 'redux-saga';
import { showNotification } from 'actions/notifications';

interface IFullWalletAndTransaction {
  wallet: IFullWallet;
  tx: Tx;
}

const signTransactionWrapper = (func: (IWalletAndTx: IFullWalletAndTransaction) => SagaIterator) =>
  function*(partialTx: SignLocalTransactionRequestedAction | SignWeb3TransactionRequestedAction) {
    try {
      const IWalletAndTx: IFullWalletAndTransaction = yield call(
        getWalletAndTransaction,
        partialTx.payload
      );
      yield call(getFrom);
      yield call(func, IWalletAndTx);
    } catch (err) {
      yield call(handleFailedTransaction, err);
    }
  };

/**
 * @description grabs wallet and required tx parameters via selectors, and assigns
 * the rest of the tx parameters from the action
 * @param partialTx
 */
function* getWalletAndTransaction(
  partialTx: (SignLocalTransactionRequestedAction | SignWeb3TransactionRequestedAction)['payload']
) {
  // get the wallet we're going to sign with
  const wallet: null | IFullWallet = yield select(getWalletInst);
  if (!wallet) {
    throw Error('Could not get wallet instance to sign transaction');
  }
  // get the chainId
  const { chainId }: NetworkConfig = yield select(getNetworkConfig);

  // get the rest of the transaction parameters
  partialTx._chainId = chainId;
  return {
    wallet,
    tx: partialTx
  };
}

function* handleFailedTransaction(err: Error): SagaIterator {
  yield put(showNotification('danger', err.message, 5000));
  yield put(signTransactionFailed());
}

function* getFrom(): SagaIterator {
  yield put(getFromRequested());
  // wait for it to finish
  const { type }: GetFromFailedAction | GetFromSucceededAction = yield take([
    TK.GET_FROM_SUCCEEDED,
    TK.GET_FROM_FAILED
  ]);
  // continue if it doesnt fail
  if (type === TK.GET_FROM_FAILED) {
    throw Error('Could not get "from" address of wallet');
  }
}

export {
  IFullWalletAndTransaction,
  getWalletAndTransaction,
  handleFailedTransaction,
  signTransactionWrapper,
  getFrom
};
