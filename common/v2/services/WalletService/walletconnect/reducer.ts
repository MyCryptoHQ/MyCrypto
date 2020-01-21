import { WalletConnectState } from './WalletConnectProvider';

export enum WalletConnectServiceActions {
  CREATE_SESSION,
  REFRESH_SESSION
}

export interface IWalletConnectServiceAction {
  type: WalletConnectServiceActions;
  payload?: any;
}

export function walletConnectSessionReducer(
  state: WalletConnectState,
  { type, payload }: IWalletConnectServiceAction
) {
  switch (type) {
    case WalletConnectServiceActions.CREATE_SESSION: {
      console.debug('[walletConnectReducer]: querying CREATE_SESSION');
      const { session } = payload;
      return {
        ...state,
        session
      };
    }
    case WalletConnectServiceActions.REFRESH_SESSION: {
      console.debug('[walletConnectReducer]: querying REFRESH_SESSION');
      const { session } = payload;
      return {
        ...state,
        session
      };
    }
    default: {
      throw new Error('[AppReducer]: missing action type');
    }
  }
}
