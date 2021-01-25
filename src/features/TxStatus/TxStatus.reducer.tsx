import { ValuesType } from 'utility-types';

import { DEFAULT_NETWORK } from '@config';
import translate from '@translations';
import { NetworkId, TAction } from '@types';

import { makeTx } from './helpers';

interface State {
  txHash: string;
  networkId: NetworkId;
  tx?: ReturnType<typeof makeTx>;
  fetching: boolean;
  fromLink?: boolean;
  error?: JSX.Element;
}

export type ReducerAction = TAction<ValuesType<typeof txStatusReducer.actionTypes>, any>;

export const generateInitialState = (txHash: string, networkId: NetworkId) => ({
  txHash,
  networkId,
  fetching: false,
  error: undefined
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
      const fromLink = action.payload;
      return { ...state, fetching: true, fromLink };
    }

    case txStatusReducer.actionTypes.FETCH_TX_SUCCESS: {
      const tx = action.payload;
      return {
        ...state,
        fetching: false,
        tx,
        error: !tx ? translate('TX_NOT_FOUND') : undefined,
        fromLink: false
      };
    }

    case txStatusReducer.actionTypes.FETCH_TX_ERROR: {
      return { ...state, fetching: false, error: translate('TX_NOT_FOUND'), fromLink: false };
    }

    case txStatusReducer.actionTypes.CLEAR_FORM: {
      return {
        tx: undefined,
        txHash: '',
        networkId: DEFAULT_NETWORK,
        fetching: false,
        error: undefined
      };
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
  FETCH_TX_ERROR: 'FETCH_TX_ERROR',
  CLEAR_FORM: 'CLEAR_FORM'
};
