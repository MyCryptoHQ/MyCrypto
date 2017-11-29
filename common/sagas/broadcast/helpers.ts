import { SagaIterator } from 'redux-saga';
import { getWeb3Tx, getSignedTx } from 'selectors/transaction';
import { transaction } from 'libs/transaction';
import { select, call, put } from 'redux-saga/effects';
import {
  broadcastTransactionFailed,
  broadcastTransactionSucceeded,
  broadcastTransactionQueued,
  TypeKeys as TK
} from 'actions/transaction';
import { bufferToHex } from 'ethereumjs-util';
import {
  BroadcastRequestedAction,
  StateSerializedTx,
  ISerializedTxAndIndexingHash
} from 'sagas/broadcast/typings';

// we dont include the signature paramaters because web3 transactions are unsigned
const computeIndexingHash = (tx: Buffer) =>
  bufferToHex(transaction(tx).hash(false));

export const broadcastTransactionWrapper = (
  func: (serializedTx: string) => SagaIterator
) =>
  function*(action: BroadcastRequestedAction) {
    const {
      indexingHash,
      serializedTransaction
    }: ISerializedTxAndIndexingHash = yield call(
      getSerializedTxAndIndexingHash,
      action
    );

    try {
      yield put(
        broadcastTransactionQueued({
          indexingHash,
          serializedTransaction
        })
      );
      const stringTx: string = yield call(bufferToHex, serializedTransaction);
      const broadcastedHash = yield call(func, stringTx); // convert to string because node / web3 doesnt support buffers
      yield put(
        broadcastTransactionSucceeded({ indexingHash, broadcastedHash })
      );
      /*
          yield put(
      showNotification(
        'success',
        <TransactionSucceeded
          txHash={txHash}
          blockExplorer={network.blockExplorer}
        />,
        0
      )
    );
      
      */
    } catch {
      yield put(broadcastTransactionFailed({ indexingHash }));
      //yield put(showNotification('danger', error.message));
    }
  };

function* getSerializedTxAndIndexingHash({ type }: BroadcastRequestedAction) {
  const isWeb3Req = type === TK.BROADCAST_WEB3_TRANSACTION_REQUESTED;
  const txSelector = isWeb3Req ? getWeb3Tx : getSignedTx;
  const serializedTransaction: StateSerializedTx = yield select(txSelector);

  if (!serializedTransaction) {
    throw Error('Can not broadcast: tx does not exist');
  }

  // grab the hash without the signature, we're going to index by this
  const indexingHash = yield call(computeIndexingHash, serializedTransaction);

  return { serializedTransaction, indexingHash };
}
