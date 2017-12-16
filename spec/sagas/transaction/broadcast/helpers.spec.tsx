import { getWeb3Tx, getSignedTx, getTransactionStatus } from 'selectors/transaction';
import { select, call, put } from 'redux-saga/effects';
import {
  broadcastTransactionFailed,
  broadcastTransactionSucceeded,
  broadcastTransactionQueued,
  reset
} from 'actions/transaction';
import { bufferToHex } from 'ethereumjs-util';
import { showNotification } from 'actions/notifications';
import React from 'react';
import { getNetworkConfig } from 'selectors/config';
import TransactionSucceeded from 'components/ExtendedNotifications/TransactionSucceeded';
import { computeIndexingHash } from 'libs/transaction';

import { cloneableGenerator } from 'redux-saga/utils';

/* tslint:disable */
import 'actions/transaction';
import 'selectors/transaction'; //throws if not imported
/* tslint:enable */

import {
  broadcastTransactionWrapper,
  getSerializedTxAndIndexingHash,
  shouldBroadcastTransaction
} from 'sagas/transaction/broadcast/helpers';

describe('broadcastTransactionWrapper*', () => {
  const indexingHash = 'indexingHash';
  const serializedTransaction = new Buffer('serializedTransaction');
  const shouldBroadcast = true;
  const stringTx = 'stringTx';
  const broadcastedHash: any = 'broadcastedHash';
  const network: any = {
    blockExplorer: 'blockExplorer'
  };

  let random;
  const func: any = () => undefined;
  const action: any = {};
  const gens: any = {};
  gens.gen = cloneableGenerator(broadcastTransactionWrapper(func))(action);

  beforeAll(() => {
    random = Math.random;
    Math.random = () => 0.001;
  });

  afterAll(() => {
    Math.random = random;
  });

  it('should call getSerializedTxAndIndexingHash with action', () => {
    expect(gens.gen.next().value).toEqual(call(getSerializedTxAndIndexingHash, action));
  });

  it('should call shouldBroadcastTransaction with indexingHash', () => {
    expect(
      gens.gen.next({
        indexingHash,
        serializedTransaction
      }).value
    ).toEqual(call(shouldBroadcastTransaction, indexingHash));
  });

  it('should handle exceptions', () => {
    gens.clone1 = gens.gen.clone();
    const error = { message: 'message' };
    expect(gens.clone1.throw(error).value).toEqual(
      put(broadcastTransactionFailed({ indexingHash }))
    );
    expect(gens.clone1.next().value).toEqual(put(showNotification('danger', error.message)));
    expect(gens.clone1.next().done).toEqual(true);
  });

  it('should put showNotification & reset if !shouldBroadcast', () => {
    gens.clone2 = gens.gen.clone();
    expect(gens.clone2.next().value).toEqual(
      put(
        showNotification(
          'warning',
          'TxHash identical: This transaction has already been broadcasted or is broadcasting'
        )
      )
    );
    expect(gens.clone2.next().value).toEqual(put(reset()));
    expect(gens.clone2.next(!shouldBroadcast).done).toEqual(true);
  });

  it('should put broadcastTransactionQueued', () => {
    expect(gens.gen.next(shouldBroadcast).value).toEqual(
      put(
        broadcastTransactionQueued({
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
        broadcastTransactionSucceeded({
          indexingHash,
          broadcastedHash
        })
      )
    );
  });

  it('select getNetworkConfig', () => {
    expect(gens.gen.next().value).toEqual(select(getNetworkConfig));
  });

  it('should put showNotification', () => {
    expect(gens.gen.next(network).value).toEqual(
      put(
        showNotification(
          'success',
          <TransactionSucceeded txHash={broadcastedHash} blockExplorer={network.blockExplorer} />,
          0
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
  gens.gen = cloneableGenerator(shouldBroadcastTransaction)(indexingHash);

  it('should select getTransactionStats with indexingHash', () => {
    expect(gens.gen.next().value).toEqual(select(getTransactionStatus, indexingHash));
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
  gens.gen1 = cloneableGenerator(getSerializedTxAndIndexingHash)(web3Req);
  const gen2 = getSerializedTxAndIndexingHash(notWeb3Req);

  it('should select getWeb3Tx', () => {
    expect(gens.gen1.next().value).toEqual(select(getWeb3Tx));
  });

  it('should select getSignedTx', () => {
    expect(gen2.next().value).toEqual(select(getSignedTx));
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
