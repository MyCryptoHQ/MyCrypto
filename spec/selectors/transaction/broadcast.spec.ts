import {
  getTransactionStatus,
  currentTransactionFailed,
  currentTransactionBroadcasting,
  currentTransactionBroadcasted,
  getCurrentTransactionStatus
} from 'selectors/transaction';
import TEST_STATE from './TestState.json';

describe('broadcast selector', () => {
  const broadcastState = TEST_STATE.transaction.broadcast;
  const indexingHash = 'testIndexingHash';

  it('should check getBroadcastState', () => {
    expect(getTransactionStatus(TEST_STATE, indexingHash)).toEqual(broadcastState[indexingHash]);
  });

  it('should check currentTransactionFailed', () => {
    expect(currentTransactionFailed(TEST_STATE)).toEqual(false);
  });

  it('should check currentTransactionBroadcasting', () => {
    expect(currentTransactionBroadcasting(TEST_STATE)).toEqual(false);
  });

  it('should check currentTransactionBroadcasted', () => {
    expect(currentTransactionBroadcasted(TEST_STATE)).toEqual(true);
  });

  it('should check getCurrentTransactionStatus with an indexingHash', () => {
    expect(getCurrentTransactionStatus(TEST_STATE)).toEqual(broadcastState[indexingHash]);
  });

  it('should return false on getCurrentTransactionStatus if no index hash present', () => {
    const { sign, ...rest } = TEST_STATE.transaction;
    const ModifiedState = { ...TEST_STATE, transaction: { ...rest, sign: '' } };
    expect(getCurrentTransactionStatus(ModifiedState)).toEqual(false);
  });
});
