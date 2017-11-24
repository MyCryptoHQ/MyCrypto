import { SagaIterator } from 'redux-saga';
import { getWalletInst } from 'selectors/wallet';
import { IWallet } from 'libs/wallet';
import { getGasPriceGwei, getNetworkConfig } from 'selectors/config';
import { select, put, call, apply } from 'redux-saga/effects';
import { toWei, getDecimal } from 'libs/units';
import { SignTransactionRequestedAction } from 'actions/transaction';
import Tx from 'ethereumjs-tx';
import { NetworkConfig } from 'config/data';

function* signTransaction(
  tx: SignTransactionRequestedAction['payload']
): SagaIterator {
  // get the wallet we're going to sign with
  const wallet: null | IWallet = yield select(getWalletInst);
  if (!wallet) {
    return;
  }
  // get the chainId
  const { chainId }: NetworkConfig = yield select(getNetworkConfig);
  // get the current gas price
  const gasPriceInGwei = yield select(getGasPriceGwei);
  // should verify chainId and gas price here

  const gweiDecimal = yield call(getDecimal, 'gwei');
  const gasPriceWei = yield call(toWei, gasPriceInGwei, gweiDecimal);

  // get the rest of the transaction parameters
  tx.gasPrice = gasPriceWei;
  tx.chainId = chainId;
  const signedTx: string = yield apply(wallet, wallet.signRawTransaction, [tx]);
}
