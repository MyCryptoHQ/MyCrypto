import { SagaIterator } from 'redux-saga';
import { put, select, apply, take, call, takeEvery } from 'redux-saga/effects';
import EthTx from 'ethereumjs-tx';
import {
  setTransactionData,
  FetchTransactionDataAction,
  setRecentTransactions,
  resetTransactionData,
  TypeKeys
} from 'actions/transactions';
import {
  TypeKeys as TxTypeKeys,
  BroadcastTransactionQueuedAction,
  BroadcastTransactionSucceededAction,
  BroadcastTransactionFailedAction
} from 'actions/transaction';
import { getNodeLib } from 'selectors/config';
import { INode, TransactionData, TransactionReceipt } from 'libs/nodes';
import { saveRecentTransaction, loadRecentTransactions } from 'utils/localStorage';
import { TypeKeys as ConfigTypeKeys } from 'actions/config';

export function* fetchTxData(action: FetchTransactionDataAction): SagaIterator {
  const txhash = action.payload;
  let data: TransactionData | null = null;
  let receipt: TransactionReceipt | null = null;
  let error: string | null = null;

  const node: INode = yield select(getNodeLib);

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

  yield put(setTransactionData({ txhash, data, receipt, error }));
}

export function* saveBroadcastedTx(action: BroadcastTransactionQueuedAction) {
  const txBuffer = action.payload.serializedTransaction;
  const txIdx = action.payload.indexingHash;

  const res: BroadcastTransactionSucceededAction | BroadcastTransactionFailedAction = yield take([
    TxTypeKeys.BROADCAST_TRANSACTION_SUCCEEDED,
    TxTypeKeys.BROADCAST_TRASACTION_FAILED
  ]);

  // If our TX succeeded, save it and update the store.
  if (
    res.type === TxTypeKeys.BROADCAST_TRANSACTION_SUCCEEDED &&
    res.payload.indexingHash === txIdx
  ) {
    const tx = new EthTx(txBuffer);
    saveRecentTransaction(res.payload.broadcastedHash, tx);
    yield call(loadRecentTxs);
  }
}

export function* loadRecentTxs() {
  const recentTxs = loadRecentTransactions();
  yield put(setRecentTransactions(recentTxs));
}

export function* resetTxData() {
  yield put(resetTransactionData());
}

export default function* transactions(): SagaIterator {
  yield call(loadRecentTxs);
  yield takeEvery(TypeKeys.TRANSACTIONS_FETCH_TRANSACTION_DATA, fetchTxData);
  yield takeEvery(TxTypeKeys.BROADCAST_TRANSACTION_QUEUED, saveBroadcastedTx);
  yield takeEvery(ConfigTypeKeys.CONFIG_NODE_CHANGE, resetTxData);
}
