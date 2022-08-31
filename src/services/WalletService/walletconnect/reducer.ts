import { Overwrite, ValuesType } from 'utility-types';

import { TAction } from '@types';

import { TActionError, WalletConnectState } from './types';

// @todo convert to FSA compatible action type
type WCAction = Overwrite<
  TAction<ValuesType<typeof WcReducer.actionTypes>, any>,
  { error?: { code: TActionError } }
>;

export const initialState: WalletConnectState = {
  isConnected: false,
  isPendingSign: false,
  promptSignRetry: false,
  promptConnectionRetry: false,
  errors: []
};

export function WcReducer(
  state: WalletConnectState,
  { type, payload, error }: WCAction
): WalletConnectState {
  switch (type) {
    case WcReducer.actionTypes.INIT_SUCCESS: {
      const { uri } = payload;
      return {
        ...initialState,
        uri
      };
    }
    case WcReducer.actionTypes.CONNECTION_REQUEST: {
      return {
        ...state,
        errors: initialState.errors
      };
    }
    case WcReducer.actionTypes.CONNECTION_SUCCESS: {
      const { address, chainId } = payload;
      return {
        ...state,
        detectedAddress: address,
        detectedChainId: chainId,
        isConnected: true
      };
    }
    case WcReducer.actionTypes.CONNECTION_UPDATE: {
      const { address, chainId } = payload;
      return {
        ...state,
        detectedAddress: address,
        detectedChainId: chainId,
        errors: initialState.errors,
        promptSignRetry: false
      };
    }
    case WcReducer.actionTypes.CONNECTION_FAILURE: {
      const { code } = error!;
      return {
        ...initialState,
        errors: [code],
        promptConnectionRetry: true
      };
    }
    case WcReducer.actionTypes.SIGN_REQUEST: {
      return {
        ...state,
        errors: initialState.errors,
        isPendingSign: true,
        promptSignRetry: false
      };
    }
    case WcReducer.actionTypes.SIGN_SUCCESS: {
      return {
        ...state,
        isPendingSign: false
      };
    }
    case WcReducer.actionTypes.SIGN_FAILURE: {
      const { code } = error!;
      return {
        ...state,
        errors: [code],
        isPendingSign: false,
        promptSignRetry: true
      };
    }
    default: {
      throw new Error('[WalletConnect]: missing action type');
    }
  }
}

WcReducer.actionTypes = {
  CONNECTION_REQUEST: 'CONNECTION_REQUEST',
  CONNECTION_SUCCESS: 'CONNECTION_SUCCESS',
  CONNECTION_UPDATE: 'CONNECTION_UPDATE',
  CONNECTION_FAILURE: 'CONNECTION_FAILURE',
  SIGN_REQUEST: 'SIGN_REQUEST',
  SIGN_SUCCESS: 'SIGN_SUCCESS',
  SIGN_FAILURE: 'SIGN_FAILURE',
  INIT_SUCCESS: 'INIT_SUCCESS',
  INIT_FAILURE: 'INIT_FAILURE'
};

WcReducer.errorCodes = {
  WRONG_ADDRESS: 'WRONG_ADDRESS',
  WRONG_NETWORK: 'WRONG_NETWORK',
  CONNECTION_REJECTED: 'CONNECTION_REJECTED',
  CONNECTION_DISCONNECTED: 'CONNECTION_DISCONNECTED',
  SESSION_FAILED: 'SESSION_FAILED',
  SIGN_REJECTED: 'SIGN_REJECTED'
};
