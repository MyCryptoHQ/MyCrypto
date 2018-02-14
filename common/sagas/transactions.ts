import { setTransactionData, FetchTransactionDataAction, TypeKeys } from 'actions/transactions';
import { SagaIterator } from 'redux-saga';
import { put, select, apply, takeEvery } from 'redux-saga/effects';
import { getNodeLib } from 'selectors/config';
import { INode, TransactionData } from 'libs/nodes';

export function* fetchTxData(action: FetchTransactionDataAction): SagaIterator {
  const txhash = action.payload;
  let data: TransactionData | null = null;
  let error: string | null = null;

  const node: INode = yield select(getNodeLib);

  try {
    data = yield apply(node, node.getTransactionByHash, [txhash]);
  } catch (err) {
    error = err.message;
  }

  yield put(setTransactionData({ txhash, data, error }));
}

export default function* gas(): SagaIterator {
  yield takeEvery(TypeKeys.TRANSACTIONS_FETCH_TRANSACTION_DATA, fetchTxData);
}
