import { getWalletInst } from 'selectors/wallet';
import { IWallet } from 'libs/wallet';
import { getGasPriceGwei, getNetworkConfig } from 'selectors/config';
import { select, call, apply, put } from 'redux-saga/effects';
import { toWei, getDecimal, Wei } from 'libs/units';
import {
  SignTransactionRequestedAction,
  signTransactionFailed
} from 'actions/transaction';
import Tx from 'ethereumjs-tx';
import { NetworkConfig } from 'config/data';
import { SagaIterator } from 'redux-saga';
import { showNotification } from 'actions/notifications';
import { toBuffer } from 'ethereumjs-util';
export {
  IWalletAndTransaction,
  getWalletAndTransaction,
  handleFailedTransaction
};

function* getGasPrice() {
  // get the current gas price
  const gasPriceInGwei: number = yield select(getGasPriceGwei);
  // should verify chainId and gas price here

  const gweiDecimal: number = yield call(getDecimal, 'gwei');
  const gasPriceWei: Wei = yield call(
    toWei,
    gasPriceInGwei.toString(),
    gweiDecimal
  );

  const gasPriceBuffer: Buffer = yield call(toBuffer, gasPriceWei);
  return gasPriceBuffer;
}
interface IWalletAndTransaction<T = IWallet> {
  wallet: T;
  tx: Tx;
}

/**
 * @description grabs wallet and required tx parameters via selectors, and assigns
 * the rest of the tx parameters from the action
 * @param partialTx
 */
function* getWalletAndTransaction(
  partialTx: SignTransactionRequestedAction['payload']
) {
  // get the wallet we're going to sign with
  const wallet: null | IWallet = yield select(getWalletInst);
  if (!wallet) {
    throw Error('Could not get wallet instance to sign transaction');
  }
  // get the chainId
  const { chainId }: NetworkConfig = yield select(getNetworkConfig);
  const gasPrice: Buffer = yield call(getGasPrice);

  // get the rest of the transaction parameters
  partialTx.gasPrice = gasPrice;
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
