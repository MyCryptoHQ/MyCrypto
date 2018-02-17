import { setTransactionData, FetchTransactionDataAction, TypeKeys } from 'actions/transactions';
import { SagaIterator } from 'redux-saga';
import { put, select, apply, takeEvery } from 'redux-saga/effects';
import { getNodeLib } from 'selectors/config';
import { INode, TransactionData, TransactionReceipt } from 'libs/nodes';

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

export default function* transactions(): SagaIterator {
  yield takeEvery(TypeKeys.TRANSACTIONS_FETCH_TRANSACTION_DATA, fetchTxData);
}
