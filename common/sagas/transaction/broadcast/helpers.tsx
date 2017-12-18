import { SagaIterator } from 'redux-saga';
import { getWeb3Tx, getSignedTx, getTransactionStatus } from 'selectors/transaction';
import { select, call, put } from 'redux-saga/effects';
import {
  broadcastTransactionFailed,
  broadcastTransactionSucceeded,
  broadcastTransactionQueued,
  TypeKeys as TK,
  reset
} from 'actions/transaction';
import { bufferToHex } from 'ethereumjs-util';
import {
  BroadcastRequestedAction,
  StateSerializedTx,
  ISerializedTxAndIndexingHash
} from 'sagas/transaction/broadcast/typings';
import { ITransactionStatus } from 'reducers/transaction/broadcast';
import { showNotification } from 'actions/notifications';
import React from 'react';
import { getNetworkConfig } from 'selectors/config';
import TransactionSucceeded from 'components/ExtendedNotifications/TransactionSucceeded';
import { computeIndexingHash } from 'libs/transaction';

export const broadcastTransactionWrapper = (func: (serializedTx: string) => SagaIterator) =>
  function* handleBroadcastTransaction(action: BroadcastRequestedAction) {
    const { indexingHash, serializedTransaction }: ISerializedTxAndIndexingHash = yield call(
      getSerializedTxAndIndexingHash,
      action
    );

    try {
      const shouldBroadcast = yield call(shouldBroadcastTransaction, indexingHash);
      if (!shouldBroadcast) {
        yield put(
          showNotification(
            'warning',
            'TxHash identical: This transaction has already been broadcasted or is broadcasting'
          )
        );
        yield put(reset());
        return;
      }
      const queueAction = broadcastTransactionQueued({
        indexingHash,
        serializedTransaction
      });
      yield put(queueAction);
      const stringTx: string = yield call(bufferToHex, serializedTransaction);
      const broadcastedHash = yield call(func, stringTx); // convert to string because node / web3 doesnt support buffers
      yield put(broadcastTransactionSucceeded({ indexingHash, broadcastedHash }));

      const network = yield select(getNetworkConfig);
      //TODO: make this not ugly
      yield put(
        showNotification(
          'success',
          <TransactionSucceeded txHash={broadcastedHash} blockExplorer={network.blockExplorer} />,
          0
        )
      );
    } catch (error) {
      yield put(broadcastTransactionFailed({ indexingHash }));
      yield put(showNotification('danger', (error as Error).message));
    }
  };

export function* shouldBroadcastTransaction(indexingHash: string): SagaIterator {
  const existingTx: ITransactionStatus | null = yield select(getTransactionStatus, indexingHash);
  // if the transaction already exists
  if (existingTx) {
    // and is still broadcasting or already broadcasting, dont re-broadcast
    if (existingTx.isBroadcasting || existingTx.broadcastSuccessful) {
      return false;
    }
  }
  return true;
}
export function* getSerializedTxAndIndexingHash({ type }: BroadcastRequestedAction) {
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
