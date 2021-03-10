import { Overwrite, ValuesType } from 'utility-types';

import { TAction } from '@types';

import { DeterministicWalletState } from './types';

export enum DWActionTypes {
  CONNECTION_REQUEST = 'CONNECTION_REQUEST',
  CONNECTION_SUCCESS = 'CONNECTION_SUCCESS',
  CONNECTION_FAILURE = 'CONNECTION_FAILURE',
  GET_ADDRESSES_REQUEST = 'GET_ADDRESSES_REQUEST',
  GET_ADDRESSES_SUCCESS = 'GET_ADDRESSES_SUCCESS',
  GET_ADDRESSES_FAILURE = 'GET_ADDRESSES_FAILURE',
  UPDATE_ACCOUNTS = 'UPDATE_ACCOUNTS',
  ENQUEUE_ADDRESSES = 'ENQUEUE_ADDRESSES',
  UPDATE_ASSET = 'UPDATE_ASSET',
  RELOAD_QUEUES = 'RELOAD_QUEUES',
  TRIGGER_COMPLETE = 'TRIGGER_COMPLETE',
  ADD_CUSTOM_DPATHS = 'ADD_CUSTOM_DPATHS'
}

// @todo convert to FSA compatible action type
export type DWAction = Overwrite<
  TAction<ValuesType<typeof DWActionTypes>, any>,
  { error?: { code: string; message: string } }
>;

export const initialState: DeterministicWalletState = {
  asset: undefined,
  isInit: false,
  isConnected: false,
  session: undefined,
  isConnecting: false,
  detectedChainId: undefined,
  promptConnectionRetry: false,
  isGettingAccounts: false,
  completed: false,
  queuedAccounts: [],
  finishedAccounts: [],
  customDPaths: [],
  error: undefined
};

const DeterministicWalletReducer = (
  state: DeterministicWalletState,
  { type, payload, error }: DWAction
): DeterministicWalletState => {
  console.debug("[",type,"]: triggered", state)
  switch (type) {
    case DWActionTypes.CONNECTION_REQUEST: {
      return {
        ...state,
        isConnecting: true,
        error: initialState.error
      };
    }
    case DWActionTypes.CONNECTION_FAILURE: {
      const { code, message } = error!;
      return {
        ...state,
        error: {
          code,
          message
        },
        isConnecting: false,
        promptConnectionRetry: true
      };
    }
    case DWActionTypes.CONNECTION_SUCCESS: {
      const { session, asset } = payload;
      return {
        ...state,
        isConnected: true,
        isConnecting: false,
        error: initialState.error,
        asset,
        session
      };
    }
    case DWActionTypes.GET_ADDRESSES_REQUEST: {
      return {
        ...state,
        isGettingAccounts: true,
        completed: false
      };
    }
    case DWActionTypes.GET_ADDRESSES_SUCCESS: {
      return {
        ...state,
        isGettingAccounts: false,
        error: initialState.error
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
      const { accounts, asset } = payload;
      // handles asset updates more-gracefully
      if (asset.uuid !== state.asset!.uuid) {
        return state;
      }
      return {
        ...state,
        queuedAccounts: [
          ...state.queuedAccounts.filter(({ address }) => accounts.includes(address))
        ],
        finishedAccounts: [...state.finishedAccounts, ...accounts]
      };
    }
    case DWActionTypes.GET_ADDRESSES_FAILURE: {
      const { code, message } = error!;
      return {
        ...state,
        completed: true,
        isGettingAccounts: false,
        error: { code, message }
      };
    }
    case DWActionTypes.UPDATE_ASSET: {
      const { asset } = payload;
      return {
        ...state,
        asset,
        completed: false,
        queuedAccounts: [
          ...state.queuedAccounts,
          ...state.finishedAccounts.map((account) => ({ ...account, balance: undefined }))
        ],
        finishedAccounts: []
      };
    }
    case DWActionTypes.ADD_CUSTOM_DPATHS: {
      const { dpaths } = payload;
      return {
        ...state,
        completed: false,
        customDPaths: [...state.customDPaths, ...dpaths]
      };
    }
    case DWActionTypes.TRIGGER_COMPLETE: {
      return { ...state, completed: true };
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
