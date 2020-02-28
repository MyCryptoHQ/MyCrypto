import { useReducer } from 'react';
import { ValuesType } from 'utility-types';

import { usePromise } from 'v2/vendor';

interface Action {
  type: ValuesType<typeof ActionTypes>;
  payload?: any;
  error?: any;
}

const ActionTypes = {
  REQUEST: 'REQUEST',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE'
};

interface TState {
  isPending: boolean;
  txHash?: any;
  errors?: any[];
}

const initialState: TState = {
  isPending: false
};

function SendTxReducer(state: TState, { type, payload, error }: Action): TState {
  switch (type) {
    case ActionTypes.REQUEST: {
      return {
        ...state,
        isPending: true,
        errors: []
      };
    }
    case ActionTypes.SUCCESS: {
      return {
        ...state,
        isPending: false,
        txHash: payload.txHash
      };
    }
    case ActionTypes.FAILURE: {
      return {
        ...state,
        isPending: false,
        errors: [error]
      };
    }
    default: {
      return state;
    }
  }
}

export const useSendTx = (fn: Promise<any>) => {
  const mounted = usePromise();
  const [state, dispatch] = useReducer(SendTxReducer, initialState);

  const send = async (tx: any): Promise<void> => {
    dispatch({ type: ActionTypes.REQUEST });
    try {
      //@ts-ignore
      const txHash = await mounted(fn(tx));
      dispatch({
        type: ActionTypes.SUCCESS,
        payload: { txHash }
      });
    } catch (err) {
      dispatch({
        type: ActionTypes.FAILURE,
        error: err
      });
    }
  };

  return {
    send,
    isPending: state.isPending,
    txHash: state.txHash,
    errors: state.errors
  };
};
