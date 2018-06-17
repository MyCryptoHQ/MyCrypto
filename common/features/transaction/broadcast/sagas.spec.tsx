import { cloneableGenerator } from 'redux-saga/utils';
import { call, put, select, apply } from 'redux-saga/effects';
import { bufferToHex } from 'ethereumjs-util';

import { computeIndexingHash } from 'libs/transaction';
import Web3Wallet from 'libs/wallet/non-deterministic/web3';
import * as configNodesSelectors from 'features/config/nodes/selectors';
import * as configSelectors from 'features/config/selectors';
import { walletSelectors } from 'features/wallet';
import { scheduleSelectors } from 'features/schedule';
import { notificationsActions } from 'features/notifications';
import { transactionFieldsActions } from '../fields';
import { transactionSignSelectors } from '../sign';
import * as actions from './actions';
import * as selectors from './selectors';
import * as sagas from './sagas';

describe('Broadcast Sagas', () => {
  describe('broadcastLocalTransactionHandler*', () => {
    const signedTx = 'signedTx';
    const node: any = {
      sendRawTx: jest.fn()
    };
    const txHash = 'txHash';

    const gen = sagas.broadcastLocalTransactionHandler(signedTx);

    it('should select getNodeLib', () => {
      expect(gen.next().value).toEqual(select(configNodesSelectors.getNodeLib));
    });

    it('should apply node.sendRawTx', () => {
      expect(gen.next(node).value).toEqual(apply(node, node.sendRawTx, [signedTx]));
    });

    it('should return txHash', () => {
      expect(gen.next(txHash).value).toEqual(txHash);
    });

    it('should be done', () => {
      expect(gen.next().done).toEqual(true);
    });
  });

  describe('broadcastWeb3TransactionHandler*', () => {
    const tx = 'tx';
    const notWeb3Wallet = false;
    const web3Wallet = new Web3Wallet('', '');
    const txHash = 'txHash';
    const nodeLib = { getNetVersion: () => 'ETH' };
    const netId = 'ETH';
    const networkConfig = { id: 'ETH' };

    const gens: any = {};
    gens.gen = cloneableGenerator(sagas.broadcastWeb3TransactionHandler)(tx);

    it('should select getWalletInst', () => {
      expect(gens.gen.next().value).toEqual(select(walletSelectors.getWalletInst));
    });

    it('should throw if not a web3 wallet', () => {
      gens.clone1 = gens.gen.clone();
      expect(() => gens.clone1.next(notWeb3Wallet)).toThrow();
    });

    it('should apply wallet.sendTransaction', () => {
      gens.gen.next(web3Wallet);
      gens.gen.next(nodeLib);
      gens.gen.next(netId);
      expect(gens.gen.next(networkConfig).value).toEqual(
        apply(web3Wallet as any, web3Wallet.sendTransaction as any, [tx, nodeLib, networkConfig])
      );
    });

    it('should return txHash', () => {
      expect(gens.gen.next(txHash).value).toEqual(txHash);
    });

    it('should be done', () => {
      expect(gens.gen.next().done).toEqual(true);
    });
  });
});

describe('Broadcast sagas', () => {
  describe('broadcastTransactionWrapper*', () => {
    const indexingHash = 'indexingHash';
    const serializedTransaction = new Buffer('serializedTransaction');
    const shouldBroadcast = true;
    const stringTx = 'stringTx';
    const broadcastedHash: any = 'broadcastedHash';
    const network: any = {
      blockExplorer: 'blockExplorer'
    };

    let random: () => number;
    const func: any = () => undefined;
    const action: any = {};
    const gens: any = {};
    gens.gen = cloneableGenerator(sagas.broadcastTransactionWrapper(func))(action);

    beforeAll(() => {
      random = Math.random;
      Math.random = () => 0.001;
    });

    afterAll(() => {
      Math.random = random;
    });

    it('should call getSerializedTxAndIndexingHash with action', () => {
      expect(gens.gen.next().value).toEqual(call(sagas.getSerializedTxAndIndexingHash, action));
    });

    it('should call shouldBroadcastTransaction with indexingHash', () => {
      expect(
        gens.gen.next({
          indexingHash,
          serializedTransaction
        }).value
      ).toEqual(call(sagas.shouldBroadcastTransaction, indexingHash));
    });

    it('should handle exceptions', () => {
      gens.clone1 = gens.gen.clone();
      const error = { message: 'message' };
      expect(gens.clone1.throw(error).value).toEqual(
        put(actions.broadcastTransactionFailed({ indexingHash }))
      );
      expect(gens.clone1.next().value).toEqual(
        put(notificationsActions.showNotification('danger', error.message))
      );
      expect(gens.clone1.next().done).toEqual(true);
    });

    it('should put showNotification & reset if !shouldBroadcast', () => {
      gens.clone2 = gens.gen.clone();
      expect(gens.clone2.next().value).toEqual(
        put(
          notificationsActions.showNotification(
            'warning',
            'TxHash identical: This transaction has already been broadcasted or is broadcasting'
          )
        )
      );
      expect(gens.clone2.next().value).toEqual(
        put(transactionFieldsActions.resetTransactionRequested())
      );
      expect(gens.clone2.next(!shouldBroadcast).done).toEqual(true);
    });

    it('should put broadcastTransactionQueued', () => {
      expect(gens.gen.next(shouldBroadcast).value).toEqual(
        put(
          actions.broadcastTransactionQueued({
            indexingHash,
            serializedTransaction
          })
        )
      );
    });

    it('should call bufferToHex with serializedTransactioin', () => {
      expect(gens.gen.next().value).toEqual(call(bufferToHex, serializedTransaction));
    });

    it('should call func with stringTx', () => {
      expect(gens.gen.next(stringTx).value).toEqual(call(func, stringTx));
    });

    it('should put broadcastTransactionSucceeded', () => {
      expect(gens.gen.next(broadcastedHash).value).toEqual(
        put(
          actions.broadcastTransactionSucceeded({
            indexingHash,
            broadcastedHash
          })
        )
      );
    });

    it('select getNetworkConfig', () => {
      expect(gens.gen.next().value).toEqual(select(configSelectors.getNetworkConfig));
    });

    it('select isSchedulingEnabled', () => {
      expect(gens.gen.next(network).value).toEqual(select(scheduleSelectors.isSchedulingEnabled));
    });

    it('should put showNotification', () => {
      expect(gens.gen.next(false).value).toEqual(
        put(
          notificationsActions.showNotificationWithComponent(
            'success',
            '',
            {
              component: 'TransactionSucceeded',
              txHash: broadcastedHash,
              blockExplorer: network.blockExplorer,
              scheduling: false
            },
            Infinity
          )
        )
      );
    });

    it('should be done', () => {
      expect(gens.gen.next().done).toEqual(true);
    });
  });

  describe('shouldBroadCastTransaction*', () => {
    const indexingHash = 'indexingHash';
    const existingTxIsBroadcasting: any = {
      isBroadcasting: true
    };
    const existingTxBroadcastSuccessful: any = {
      broadcastSuccessful: true
    };
    const existingTxFalse: any = false;

    const gens: any = {};
    gens.gen = cloneableGenerator(sagas.shouldBroadcastTransaction)(indexingHash);

    it('should select getTransactionStats with indexingHash', () => {
      expect(gens.gen.next().value).toEqual(select(selectors.getTransactionStatus, indexingHash));
    });

    it('should return false when isBroadcasting', () => {
      gens.clone1 = gens.gen.clone();
      expect(gens.clone1.next(existingTxIsBroadcasting).value).toEqual(false);
    });

    it('should return false when broadcastSuccessful', () => {
      gens.clone2 = gens.gen.clone();
      expect(gens.clone2.next(existingTxBroadcastSuccessful).value).toEqual(false);
    });

    it('should return true when there is no existingTx', () => {
      gens.gen = gens.gen.clone();
      expect(gens.gen.next(existingTxFalse).value).toEqual(true);
    });

    it('should be done', () => {
      expect(gens.gen.next().done).toEqual(true);
    });
  });

  describe('getSerializedTxAndIndexingHash*', () => {
    const web3Req: any = {
      type: 'BROADCAST_WEB3_TRANSACTION_REQUESTED'
    };
    const notWeb3Req: any = {
      type: 'NOT_WEB3_TRANSACTION_REQUEST'
    };
    const serializedTransaction: any = true;
    const indexingHash = 'indexingHash';

    const gens: any = {};
    gens.gen1 = cloneableGenerator(sagas.getSerializedTxAndIndexingHash)(web3Req);
    const gen2 = sagas.getSerializedTxAndIndexingHash(notWeb3Req);

    it('should select getWeb3Tx', () => {
      expect(gens.gen1.next().value).toEqual(select(transactionSignSelectors.getWeb3Tx));
    });

    it('should select getSignedTx', () => {
      expect(gen2.next().value).toEqual(select(transactionSignSelectors.getSignedTx));
    });

    it('should throw error if !serializedTransaction', () => {
      gens.clone1 = gens.gen1.clone();
      expect(() => gens.clone1.next(!serializedTransaction)).toThrowError(
        'Can not broadcast: tx does not exist'
      );
    });

    it('should call computeIndexingHash', () => {
      expect(gens.gen1.next(serializedTransaction).value).toEqual(
        call(computeIndexingHash, serializedTransaction)
      );
    });

    it('should return correctly', () => {
      expect(gens.gen1.next(indexingHash).value).toEqual({
        serializedTransaction,
        indexingHash
      });
    });

    it('should be done', () => {
      expect(gens.gen1.next().done).toEqual(true);
    });
  });
});
