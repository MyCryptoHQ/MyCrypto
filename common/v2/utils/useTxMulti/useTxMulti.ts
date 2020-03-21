import { useReducer } from 'reinspect';
import * as R from 'ramda';

import { TxMultiReducer, initialState } from './reducer';
import { prepareTx, sendTx, reset } from './actions';
import { TxParcel, TxMultiState } from './types';

/*
  Create a queue of transactions the need to be sent in order.
  When you know which txs you want to send you:
  1. call `initQueue([tx1, tx2])`
  2. then with `currentTx` you have access to all the useTxSend methods and status tracking.
  3. when the status of the previous tx is `ITxStatus.CONFIRMED` the queue will
     move to the next tx in line.
*/

export type TUseTxMulti = () => {
  init(txs: any[], account: any, network: any): Promise<void>;
  initWith(getTxs: <T>() => Promise<void | T[]>, account: any, network: any): Promise<void>;
  stopYield(): Promise<void>;
  prepareTx: ReturnType<typeof prepareTx>;
  sendTx: ReturnType<typeof sendTx>;
  reset: ReturnType<typeof reset>;
  currentTx: TxParcel;
  state: TxMultiState;
};

export const useTxMulti: TUseTxMulti = () => {
  const [state, dispatch] = useReducer(TxMultiReducer, initialState, R.identity, 'TxMulti');
  const getState = () => state;

  return {
    state,
    init: async (txs, account, network) =>
      dispatch({
        type: TxMultiReducer.actionTypes.INIT_SUCCESS,
        payload: { txs, account, network }
      }),
    initWith: async (getTxs, account, network) => {
      dispatch({ type: TxMultiReducer.actionTypes.INIT_REQUEST });
      try {
        const txs = await getTxs();
        dispatch({
          type: TxMultiReducer.actionTypes.INIT_SUCCESS,
          payload: {
            txs,
            account,
            network
          }
        });
      } catch (err) {
        dispatch({ type: TxMultiReducer.actionTypes.INIT_FAILURE, payload: err, error: true });
      }
    },
    stopYield: async () => dispatch({ type: TxMultiReducer.actionTypes.HALT_FLOW }),
    prepareTx: prepareTx(dispatch, getState),
    sendTx: sendTx(dispatch, getState),
    reset: reset(dispatch, getState),
    get currentTx(): TxParcel {
      return R.view(R.lensIndex(state._currentTxIdx), state.transactions);
    }
  };
};
