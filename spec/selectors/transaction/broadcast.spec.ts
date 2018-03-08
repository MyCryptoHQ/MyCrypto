import {
  getTransactionStatus,
  currentTransactionFailed,
  currentTransactionBroadcasting,
  currentTransactionBroadcasted,
  getCurrentTransactionStatus
} from 'selectors/transaction';
import { getInitialState } from '../helpers';

describe('broadcast selector', () => {
  const state = getInitialState();
  state.transaction = {
    ...state.transaction,
    broadcast: {
      ...state.transaction.broadcast,
      testIndexingHash1: {
        broadcastedHash: 'testBroadcastedHash',
        broadcastSuccessful: true,
        isBroadcasting: false,
        serializedTransaction: new Buffer([1, 2, 3])
      },
      testIndexingHash2: {
        broadcastedHash: 'testBroadcastedHash',
        broadcastSuccessful: true,
        isBroadcasting: false,
        serializedTransaction: new Buffer([1, 2, 3])
      }
    },
    sign: {
      ...state.transaction.sign,
      indexingHash: 'testIndexingHash1',
      pending: false
    }
  };
  it('should check getTransactionState with an indexing hash', () => {
    expect(getTransactionStatus(state, 'testIndexingHash1')).toEqual(
      state.transaction.broadcast.testIndexingHash1
    );
  });

  it('should check getCurrentTransactionStatus', () => {
    expect(getCurrentTransactionStatus(state)).toEqual(
      state.transaction.broadcast.testIndexingHash2
    );
  });

  it('should check currentTransactionFailed', () => {
    expect(currentTransactionFailed(state)).toEqual(false);
  });

  it('should check currentTransactionBroadcasting', () => {
    expect(currentTransactionBroadcasting(state)).toEqual(false);
  });

  it('should check currentTransactionBroadcasted', () => {
    expect(currentTransactionBroadcasted(state)).toEqual(true);
  });

  it('should return false on getCurrentTransactionStatus if no index hash present', () => {
    state.transaction.sign.indexingHash = null;
    expect(getCurrentTransactionStatus(state)).toEqual(false);
  });
});
