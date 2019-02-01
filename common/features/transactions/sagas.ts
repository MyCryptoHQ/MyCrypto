import { SagaIterator } from 'redux-saga';
import { put, select, apply, call, take, takeEvery } from 'redux-saga/effects';
import EthTx from 'ethereumjs-tx';

import { INode } from 'libs/nodes';
import { hexEncodeData } from 'libs/nodes/rpc/utils';
import { getTransactionFields } from 'libs/transaction';
import { NetworkConfig } from 'types/network';
import { TransactionData, TransactionReceipt, SavedTransaction } from 'types/transactions';
import { AppState } from 'features/reducers';
import { configSelectors, configNodesSelectors } from 'features/config';
import { walletSelectors } from 'features/wallet';
import { transactionBroadcastTypes, transactionTypes } from 'features/transaction';
import * as networkActions from '../transaction/network/actions';
import * as types from './types';
import * as actions from './actions';

export function* fetchTxData(action: types.FetchTransactionDataAction): SagaIterator {
  const txhash = action.payload;
  let data: TransactionData | null = null;
  let receipt: TransactionReceipt | null = null;
  let error: string | null = null;

  const node: INode = yield select(configNodesSelectors.getNodeLib);

  // Fetch data and receipt separately, not in parallel. Receipt should only be
  // fetched if the tx is mined, and throws if it's not, but that's not really
  // an "error", since we'd still want to show the unmined tx data.
  try {
    data = yield apply(node, node.getTransactionByHash, [txhash]);
  } catch (err) {
    console.warn('Failed to fetch transaction data', err);
    error = err.message;
  }

  if (data && data.blockHash) {
    try {
      receipt = yield apply(node, node.getTransactionReceipt, [txhash]);
    } catch (err) {
      console.warn('Failed to fetch transaction receipt', err);
      receipt = null;
    }
  }

  yield put(actions.setTransactionData({ txhash, data, receipt, error }));
}

export function* saveBroadcastedTx(
  action: transactionBroadcastTypes.BroadcastTransactionQueuedAction
) {
  const { serializedTransaction: txBuffer, indexingHash: txIdx } = action.payload;

  const res:
    | transactionBroadcastTypes.BroadcastTransactionSucceededAction
    | transactionBroadcastTypes.BroadcastTransactionFailedAction = yield take([
    transactionBroadcastTypes.TransactionBroadcastActions.TRANSACTION_SUCCEEDED,
    transactionBroadcastTypes.TransactionBroadcastActions.TRANSACTION_FAILED
  ]);

  // If our TX succeeded, save it and update the store.
  if (
    res.type === transactionBroadcastTypes.TransactionBroadcastActions.TRANSACTION_SUCCEEDED &&
    res.payload.indexingHash === txIdx
  ) {
    const tx = new EthTx(txBuffer);
    const savableTx: SavedTransaction = yield call(
      getSaveableTransaction,
      tx,
      res.payload.broadcastedHash
    );
    yield put(actions.addRecentTransaction(savableTx));
  }
}

// Given a serialized transaction, return a transaction we could save in LS
export function* getSaveableTransaction(tx: EthTx, hash: string): SagaIterator {
  const fields = getTransactionFields(tx);
  const nonceHex: string = tx.toJSON()[0];
  const nonce: number = parseInt(nonceHex, 16);
  let from: string = '';
  let chainId: number = 0;

  try {
    // Signed transactions have these fields
    from = hexEncodeData(tx.getSenderAddress());
    chainId = fields.chainId;
  } catch (err) {
    // Unsigned transactions (e.g. web3) don't, so grab them from current state
    const wallet: AppState['wallet']['inst'] = yield select(walletSelectors.getWalletInst);
    const network: NetworkConfig = yield select(configSelectors.getNetworkConfig);

    chainId = network.chainId;
    if (wallet) {
      from = wallet.getAddressString();
    }
  }
  const toChecksumAddress = yield select(configSelectors.getChecksumAddressFn);
  const savableTx: SavedTransaction = {
    hash,
    from,
    chainId,
    nonce,
    to: toChecksumAddress(fields.to),
    value: fields.value,
    time: Date.now()
  };
  return savableTx;
}

export function* resetTxData() {
  yield put(actions.resetTransactionData());
}

export function* getNonce() {
  yield put(networkActions.getNonceRequested());
}

export function* transactionsSaga(): SagaIterator {
  yield takeEvery(types.TransactionsActions.FETCH_TRANSACTION_DATA, fetchTxData);
  yield takeEvery(
    transactionBroadcastTypes.TransactionBroadcastActions.TRANSACTION_QUEUED,
    saveBroadcastedTx
  );
  yield takeEvery(types.TransactionsActions.RESET_TRANSACTION_DATA, resetTxData);
  yield takeEvery(transactionTypes.TransactionActions.RESET_SUCCESSFUL, getNonce);
}
