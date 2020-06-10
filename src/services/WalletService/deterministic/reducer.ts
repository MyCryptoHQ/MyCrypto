import { ValuesType, Overwrite } from 'utility-types';

import { DeterministicWalletState, TActionError } from './types';
import { TAction } from '@types';

export enum DWActionTypes {
  CONNECTION_REQUEST = 'CONNECTION_REQUEST',
  CONNECTION_SUCCESS = 'CONNECTION_SUCCESS',
  CONNECTION_FAILURE = 'CONNECTION_FAILURE',
  GET_ADDRESSES_REQUEST = 'GET_ADDRESSES_REQUEST',
  GET_ADDRESSES_SUCCESS = 'GET_ADDRESSES_SUCCESS',
  GET_ADDRESSES_FAILURE = 'GET_ADDRESSES_FAILURE',
  UPDATE_ACCOUNTS = 'UPDATE_ACCOUNTS',
  ENQUEUE_ADDRESSES = 'ENQUEUE_ADDRESSES'
}

// @todo convert to FSA compatible action type
type DWAction = Overwrite<
  TAction<ValuesType<typeof DWActionTypes>, any>,
  { error?: { code: TActionError } }
>;

export const initialState: DeterministicWalletState = {
  isInit: false,
  isConnected: false,
  session: undefined,
  isConnecting: false,
  detectedChainId: undefined,
  promptConnectionRetry: false,
  isGettingAccounts: false,
  queuedAccounts: [],
  finishedAccounts: [],
  errors: []
};

const DeterministicWalletReducer = (
  state: DeterministicWalletState,
  { type, payload, error }: DWAction
): DeterministicWalletState => {
  switch (type) {
    case DWActionTypes.CONNECTION_REQUEST: {
      return {
        ...state,
        isConnecting: true,
        errors: initialState.errors
      };
    }
    case DWActionTypes.CONNECTION_FAILURE: {
      const { code } = error!;
      return {
        ...state,
        errors: [code],
        isConnecting: false,
        promptConnectionRetry: true
      };
    }
    case DWActionTypes.CONNECTION_SUCCESS: {
      const { session } = payload;
      return {
        ...state,
        isConnected: true,
        isConnecting: false,
        errors: initialState.errors,
        session
      };
    }
    case DWActionTypes.GET_ADDRESSES_REQUEST: {
      return {
        ...state,
        isGettingAccounts: true
      };
    }
    case DWActionTypes.GET_ADDRESSES_SUCCESS: {
      return {
        ...state,
        isGettingAccounts: false
      };
    }
    case DWActionTypes.ENQUEUE_ADDRESSES: {
      const { accounts } = payload;
      return {
        ...state,
        queuedAccounts: [...state.queuedAccounts, ...accounts]
      };
    }
    case DWActionTypes.UPDATE_ACCOUNTS: {
      const { accounts } = payload;
      return {
        ...state,
        queuedAccounts: [
          ...state.queuedAccounts.filter(({ address }) => accounts.includes(address))
        ],
        finishedAccounts: [...state.finishedAccounts, ...accounts]
      };
    }
    case DWActionTypes.GET_ADDRESSES_FAILURE: {
      return {
        ...state,
        isGettingAccounts: false
      };
    }
    default: {
      throw new Error('[DeterministicWallet]: missing action type');
    }
  }
};

DeterministicWalletReducer.errorCodes = {
  SESSION_CONNECTION_FAILED: 'SESSION_CONNECTION_FAILED',
  GET_ACCOUNTS_FAILED: 'GET_ACCOUNTS_FAILED'
};

export default DeterministicWalletReducer;
