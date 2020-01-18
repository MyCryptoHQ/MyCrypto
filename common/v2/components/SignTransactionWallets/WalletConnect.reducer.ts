import { ExtendedAccount, ITxObject } from 'v2/types';
import { IWalletConnectState, WalletSigningState } from './WalletConnect';

export enum WalletConnectReducer {
  DETECT_ADDRESS,
  BROADCAST_SIGN_TX,
  BROADCAST_SIGN_TX_ERROR,
  CLEAR_ERROR,
  SET_WALLET_SIGNING_STATE_READY
}

export interface IWalletConnectReducer {
  type: WalletConnectReducer;
  payload?: any;
}

export function walletConnectReducer(
  state: IWalletConnectState,
  { type, payload }: IWalletConnectReducer
) {
  switch (type) {
    case WalletConnectReducer.DETECT_ADDRESS: {
      const {
        address,
        chainId,
        senderAccount,
        rawTransaction
      }: {
        address: string;
        chainId: number;
        senderAccount: ExtendedAccount;
        rawTransaction: ITxObject;
      } = payload;
      return {
        ...state,
        isConnected: true,
        detectedAddress: address,
        isCorrectAddress: address.toLowerCase() === senderAccount.address.toLowerCase(),
        isCorrectNetwork: chainId === rawTransaction.chainId
      };
    }
    case WalletConnectReducer.BROADCAST_SIGN_TX: {
      const { isPendingTx } = payload;
      return {
        ...state,
        isPendingTx
      };
    }
    case WalletConnectReducer.BROADCAST_SIGN_TX_ERROR: {
      const { errMsg, isPendingTx } = payload;
      return {
        ...state,
        signingError: errMsg,
        isPendingTx
      };
    }
    case WalletConnectReducer.CLEAR_ERROR: {
      return {
        ...state,
        signingError: ''
      };
    }
    case WalletConnectReducer.SET_WALLET_SIGNING_STATE_READY: {
      return {
        ...state,
        walletSigningState: WalletSigningState.READY
      };
    }
    default: {
      throw new Error('[WalletConnect]: missing action type');
    }
  }
}
