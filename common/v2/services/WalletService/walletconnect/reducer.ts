import { WalletConnectQRState, TWalletConnectSession } from './WalletConnectProvider';

export enum WalletConnectServiceActions {
  CREATE_SESSION,
  REFRESH_SESSION,
  CHANGE_WALLET_UNLOCK_STATE_REQUESTED
}

export interface IWalletConnectServiceAction {
  type: WalletConnectServiceActions;
  payload?: any;
}

export interface WalletConnectState {
  session: TWalletConnectSession;
  walletUnlockState: WalletConnectQRState;
}

export function walletConnectReducer(
  state: WalletConnectState,
  { type, payload }: IWalletConnectServiceAction
) {
  switch (type) {
    case WalletConnectServiceActions.CREATE_SESSION: {
      console.debug('[walletConnectReducer]: querying CREATE_SESSION');
      const { session, walletUnlockState } = payload;
      return {
        ...state,
        session,
        walletUnlockState
      };
    }
    case WalletConnectServiceActions.REFRESH_SESSION: {
      console.debug('[walletConnectReducer]: querying REFRESH_SESSION');
      const { session, walletUnlockState } = payload;
      return {
        ...state,
        session,
        walletUnlockState
      };
    }
    case WalletConnectServiceActions.CHANGE_WALLET_UNLOCK_STATE_REQUESTED: {
      console.debug('[walletConnectReducer]: querying CHANGE_WALLET_UNLOCK_STATE_REQUESTED');
      const { walletUnlockState } = payload;
      return {
        ...state,
        walletUnlockState
      };
    }
    default: {
      throw new Error('[AppReducer]: missing action type');
    }
  }
}

export default walletConnectReducer;
