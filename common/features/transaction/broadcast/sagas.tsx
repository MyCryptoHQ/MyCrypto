import { SagaIterator } from 'redux-saga';
import { apply, select, call, put, takeEvery } from 'redux-saga/effects';
import { bufferToHex } from 'ethereumjs-util';

import { computeIndexingHash } from 'libs/transaction';
import { INode } from 'libs/nodes';
import { Web3Wallet } from 'libs/wallet';
import { NetworkConfig } from 'types/network';
import { AppState } from 'features/reducers';
import * as configNodesSelectors from 'features/config/nodes/selectors';
import * as configNetworksSelectors from 'features/config/networks/selectors';
import * as configSelectors from 'features/config/selectors';
import { walletSelectors } from 'features/wallet';
import { scheduleSelectors } from 'features/schedule';
import { notificationsActions } from 'features/notifications';
import { transactionFieldsActions } from '../fields';
import { transactionSignReducer, transactionSignSelectors } from '../sign';
import * as types from './types';
import * as actions from './actions';
import * as selectors from './selectors';

export const broadcastTransactionWrapper = (func: (serializedTx: string) => SagaIterator) =>
  function* handleBroadcastTransaction(action: types.BroadcastRequestedAction) {
    const { indexingHash, serializedTransaction }: types.ISerializedTxAndIndexingHash = yield call(
      getSerializedTxAndIndexingHash,
      action
    );

    try {
      const shouldBroadcast: boolean = yield call(shouldBroadcastTransaction, indexingHash);
      if (!shouldBroadcast) {
        yield put(
          notificationsActions.showNotification(
            'warning',
            'TxHash identical: This transaction has already been broadcasted or is broadcasting'
          )
        );
        yield put(transactionFieldsActions.resetTransactionRequested());
        return;
      }
      const queueAction = actions.broadcastTransactionQueued({
        indexingHash,
        serializedTransaction
      });
      yield put(queueAction);
      const stringTx: string = yield call(bufferToHex, serializedTransaction);
      const broadcastedHash: string = yield call(func, stringTx); // convert to string because node / web3 doesnt support buffers
      yield put(actions.broadcastTransactionSucceeded({ indexingHash, broadcastedHash }));

      const network: NetworkConfig = yield select(configSelectors.getNetworkConfig);
      const scheduling: boolean = yield select(scheduleSelectors.isSchedulingEnabled);
      yield put(
        notificationsActions.showNotificationWithComponent(
          'success',
          '',
          {
            component: 'TransactionSucceeded',
            txHash: broadcastedHash,
            blockExplorer: network.isCustom ? undefined : network.blockExplorer,
            scheduling
          },
          Infinity
        )
      );
    } catch (error) {
      yield put(actions.broadcastTransactionFailed({ indexingHash }));
      yield put(notificationsActions.showNotification('danger', (error as Error).message));
    }
  };

export function* shouldBroadcastTransaction(indexingHash: string): SagaIterator {
  const existingTx: types.ITransactionStatus | null = yield select(
    selectors.getTransactionStatus,
    indexingHash
  );
  // if the transaction already exists
  if (existingTx) {
    // and is still broadcasting or already broadcasting, dont re-broadcast
    if (existingTx.isBroadcasting || existingTx.broadcastSuccessful) {
      return false;
    }
  }
  return true;
}

export function* getSerializedTxAndIndexingHash({
  type
}: types.BroadcastRequestedAction): SagaIterator {
  const isWeb3Req = type === types.TransactionBroadcastActions.WEB3_TRANSACTION_REQUESTED;
  const txSelector = isWeb3Req
    ? transactionSignSelectors.getWeb3Tx
    : transactionSignSelectors.getSignedTx;
  const serializedTransaction: transactionSignReducer.StateSerializedTx = yield select(txSelector);

  if (!serializedTransaction) {
    throw Error('Can not broadcast: tx does not exist');
  }

  // grab the hash without the signature, we're going to index by this
  const indexingHash = yield call(computeIndexingHash, serializedTransaction);

  return { serializedTransaction, indexingHash };
}

export const broadcastLocalTransactionHandler = function*(signedTx: string): SagaIterator {
  const node: INode = yield select(configNodesSelectors.getNodeLib);
  const txHash = yield apply(node, node.sendRawTx, [signedTx.toString()]);
  return txHash;
};

export const broadcastLocalTransaction = broadcastTransactionWrapper(
  broadcastLocalTransactionHandler
);

// web3 transactions are a little different since they do signing + broadcast in 1 step
// meaning we have to grab the tx data and send it
export const broadcastWeb3TransactionHandler = function*(tx: string): SagaIterator {
  //get web3 wallet
  const wallet: AppState['wallet']['inst'] = yield select(walletSelectors.getWalletInst);
  if (!wallet || !(wallet instanceof Web3Wallet)) {
    throw Error(`Cannot broadcast: Web3 wallet not found.`);
  }

  const nodeLib = yield select(configNodesSelectors.getNodeLib);
  const netId = yield call(nodeLib.getNetVersion);
  const networkConfig = yield select(configNetworksSelectors.getNetworkByChainId, netId);

  // sign and broadcast
  const txHash: string = yield apply(wallet, wallet.sendTransaction, [tx, nodeLib, networkConfig]);
  return txHash;
};

const broadcastWeb3Transaction = broadcastTransactionWrapper(broadcastWeb3TransactionHandler);

export const broadcastSaga = [
  takeEvery(
    [types.TransactionBroadcastActions.WEB3_TRANSACTION_REQUESTED],
    broadcastWeb3Transaction
  ),
  takeEvery(
    [types.TransactionBroadcastActions.LOCAL_TRANSACTION_REQUESTED],
    broadcastLocalTransaction
  )
];
