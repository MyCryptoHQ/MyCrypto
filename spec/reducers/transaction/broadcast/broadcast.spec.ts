import { INITIAL_STATE } from 'reducers/transaction';
import { broadcast, ITransactionStatus } from 'reducers/transaction/broadcast';
import * as txActions from 'actions/transaction';

const indexingHash = 'testingHash';

describe('broadcast reducer', () => {
  const serializedTransaction = new Buffer('testSerialized');
  const nextTxStatus: ITransactionStatus = {
    broadcastedHash: null,
    broadcastSuccessful: false,
    isBroadcasting: true,
    serializedTransaction
  };
  const nextState: any = {
    ...INITIAL_STATE,
    [indexingHash]: nextTxStatus
  };
  it('should handle BROADCAST_TRANSACTION_QUEUED', () => {
    expect(
      broadcast(
        INITIAL_STATE as any,
        txActions.broadcastTransactionQueued({ indexingHash, serializedTransaction })
      )
    ).toEqual(nextState);
  });

  it('should handle BROADCAST_TRANSACTION_SUCCESS', () => {
    const broadcastedHash = 'testBroadcastHash';
    const broadcastedState = {
      ...nextState,
      [indexingHash]: {
        ...nextTxStatus,
        broadcastedHash,
        isBroadcasting: false,
        broadcastSuccessful: true
      }
    };
    expect(
      broadcast(
        nextState,
        txActions.broadcastTransactionSucceeded({ indexingHash, broadcastedHash })
      )
    ).toEqual(broadcastedState);
  });

  it('should handle BROADCAST_TRANSACTION_FAILURE', () => {
    const failedBroadcastState = {
      ...nextState,
      [indexingHash]: { ...nextTxStatus, isBroadcasting: false, broadcastSuccessful: false }
    };
    expect(broadcast(nextState, txActions.broadcastTransactionFailed({ indexingHash }))).toEqual(
      failedBroadcastState
    );
  });
});
