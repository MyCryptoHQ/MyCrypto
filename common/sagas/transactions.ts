import { SagaIterator } from 'redux-saga';
import { put, select, apply, call, take, takeEvery } from 'redux-saga/effects';
import EthTx from 'ethereumjs-tx';
import {
  setTransactionData,
  FetchTransactionDataAction,
  addRecentTransaction,
  resetTransactionData,
  TypeKeys
} from 'actions/transactions';
import {
  TypeKeys as TxTypeKeys,
  BroadcastTransactionQueuedAction,
  BroadcastTransactionSucceededAction,
  BroadcastTransactionFailedAction
} from 'actions/transaction';
import { getNodeLib, getNetworkConfig, getChecksumAddressFn } from 'selectors/config';
import { getWalletInst } from 'selectors/wallet';
import { INode } from 'libs/nodes';
import { hexEncodeData } from 'libs/nodes/rpc/utils';
import { getTransactionFields } from 'libs/transaction';
import { TypeKeys as ConfigTypeKeys } from 'actions/config';
import { TransactionData, TransactionReceipt, SavedTransaction } from 'types/transactions';
import { NetworkConfig } from 'types/network';
import { AppState } from 'reducers';

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
  const { serializedTransaction: txBuffer, indexingHash: txIdx } = action.payload;

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
    const savableTx: SavedTransaction = yield call(
      getSaveableTransaction,
      tx,
      res.payload.broadcastedHash
    );
    yield put(addRecentTransaction(savableTx));
  }
}

// Given a serialized transaction, return a transaction we could save in LS
export function* getSaveableTransaction(tx: EthTx, hash: string): SagaIterator {
  const fields = getTransactionFields(tx);
  let from: string = '';
  let chainId: number = 0;

  try {
    // Signed transactions have these fields
    from = hexEncodeData(tx.getSenderAddress());
    chainId = fields.chainId;
  } catch (err) {
    // Unsigned transactions (e.g. web3) don't, so grab them from current state
    const wallet: AppState['wallet']['inst'] = yield select(getWalletInst);
    const network: NetworkConfig = yield select(getNetworkConfig);

    chainId = network.chainId;
    if (wallet) {
      from = wallet.getAddressString();
    }
  }

  const toChecksumAddress = yield select(getChecksumAddressFn);
  const savableTx: SavedTransaction = {
    hash,
    from,
    chainId,
    to: toChecksumAddress(fields.to),
    value: fields.value,
    time: Date.now()
  };
  return savableTx;
}

export function* resetTxData() {
  yield put(resetTransactionData());
}

export default function* transactions(): SagaIterator {
  yield takeEvery(TypeKeys.TRANSACTIONS_FETCH_TRANSACTION_DATA, fetchTxData);
  yield takeEvery(TxTypeKeys.BROADCAST_TRANSACTION_QUEUED, saveBroadcastedTx);
  yield takeEvery(ConfigTypeKeys.CONFIG_CHANGE_NODE_SUCCEEDED, resetTxData);
}
