import identity from 'ramda/src/identity';
import lensIndex from 'ramda/src/lensIndex';
import view from 'ramda/src/view';
import { useReducer } from 'reinspect';

import { ITxObject } from '@types';

import { init, initWith, prepareTx, reset, sendTx, stopYield } from './actions';
import { initialState, TxMultiReducer } from './reducer';
import { TxMultiState, TxParcel } from './types';

/*
  Create a queue of transactions the need to be sent in order.
  When you know which txs you want to send you:
  1. call `init([tx1, tx2])` or `initWith(getTxs, ...)`
  2. when the status of the previous tx is `ITxStatus.CONFIRMED` the queue will
     move to the next tx in line.
*/

export type TUseTxMulti = () => {
  prepareTx: ReturnType<typeof prepareTx>;
  sendTx: ReturnType<typeof sendTx>;
  reset: ReturnType<typeof reset>;
  currentTx: TxParcel;
  state: TxMultiState;
  init(txs: any[], account: any, network: any): Promise<void>;
  initWith(getTxs: () => Promise<Partial<ITxObject>[]>, account: any, network: any): Promise<void>;
  stopYield(): Promise<void>;
};

export const useTxMulti: TUseTxMulti = () => {
  const [state, dispatch] = useReducer(TxMultiReducer, initialState, identity, 'TxMulti');
  const getState = () => state;

  return {
    state,
    init: init(dispatch),
    initWith: initWith(dispatch),
    stopYield: stopYield(dispatch),
    prepareTx: prepareTx(dispatch, getState),
    sendTx: sendTx(dispatch, getState),
    reset: reset(dispatch),
    get currentTx(): TxParcel {
      return view(lensIndex(state._currentTxIdx), state.transactions);
    }
  };
};
