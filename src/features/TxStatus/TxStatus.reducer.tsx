import { ValuesType } from 'utility-types';

import { ITxConfig, ITxReceipt, TAction, NetworkId } from '@types';
import { DEFAULT_NETWORK } from '@config';
import { translateRaw } from '@translations';

interface State {
  txHash: string;
  networkId: NetworkId;
  tx?: { config: ITxConfig; receipt: ITxReceipt };
  fetching: boolean;
  error: string;
}

export type ReducerAction = TAction<ValuesType<typeof txStatusReducer.actionTypes>, any>;

export const generateInitialState = (txHash: string, networkId: NetworkId) => ({
  txHash,
  networkId,
  fetching: false,
  error: ''
});

export const txStatusReducer = (state: State, action: ReducerAction): State => {
  switch (action.type) {
    case txStatusReducer.actionTypes.SET_NETWORK: {
      return { ...state, networkId: action.payload };
    }

    case txStatusReducer.actionTypes.SET_TX_HASH: {
      return { ...state, txHash: action.payload };
    }

    case txStatusReducer.actionTypes.FETCH_TX: {
      return { ...state, fetching: true };
    }

    case txStatusReducer.actionTypes.FETCH_TX_SUCCESS: {
      const tx = action.payload;
      return { ...state, fetching: false, tx, error: !tx ? translateRaw('TX_NOT_FOUND') : '' };
    }

    case txStatusReducer.actionTypes.CLEAR_FORM: {
      return { tx: undefined, txHash: '', networkId: DEFAULT_NETWORK, fetching: false, error: '' };
    }

    default:
      return state;
  }
};

txStatusReducer.actionTypes = {
  SET_NETWORK: 'SET_NETWORK',
  SET_TX_HASH: 'SET_TX_HASH',
  FETCH_TX: 'FETCH_TX',
  FETCH_TX_SUCCESS: 'FETCH_TX_SUCCESS',
  CLEAR_FORM: 'CLEAR_FORM'
};
