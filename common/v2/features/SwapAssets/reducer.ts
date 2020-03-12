import { ITxStatus, ITxObject } from 'v2/types';
import { SFAction, SwapState } from './types';

export const swapFlowInitialState = {
  isSubmitting: false,
  currentTxIndex: 0,
  nextInFlow: false,
  transactions: []
};

export function SwapFlowReducer(state: SwapState, { type, payload }: SFAction): SwapState {
  switch (type) {
    case 'FETCH_TRADE_REQUEST': {
      return {
        ...state,
        isSubmitting: true
      };
    }
    case 'FETCH_TRADE_SUCCESS': {
      const { formattedTxs, account, assetPair } = payload;
      const transactions = formattedTxs.map((tx: ITxObject, idx: number) => ({
        rawTx: tx,
        txHash: undefined,
        status: ITxStatus.READY,
        queuePos: idx
      }));
      return {
        ...state,
        assetPair,
        account,
        transactions,
        isSubmitting: false,
        currentTxIndex: 0,
        nextInFlow: true
      };
    }
    case 'FETCH_TRADE_FAILURE': {
      return {
        ...state,
        isSubmitting: false
      };
    }
    case 'SIGN_REQUEST': {
      // update rawTx with gasLimit and nonce.
      const transactions = state.transactions.map(t => {
        if (t.queuePos !== state.currentTxIndex) return t;
        return {
          ...t,
          rawTx: payload.rawTx,
          status: ITxStatus.SIGNED
        };
      });
      return {
        ...state,
        isSubmitting: false,
        nextInFlow: true,
        transactions
      };
    }
    case 'SIGN_FAILURE': {
      return {
        ...state,
        isSubmitting: false
      };
    }
    case 'SEND_TX_REQUEST': {
      return {
        ...state,
        isSubmitting: true
      };
    }
    case 'SEND_TX_SUCCESS': {
      const { txReceipt } = payload;
      const next = (curr: number) => Math.min(curr + 1, state.transactions.length - 1);
      const transactions = state.transactions.map(t => {
        if (t.queuePos !== state.currentTxIndex) return t;
        return {
          ...t,
          status: ITxStatus.BROADCASTED,
          txReceipt,
          txHash: txReceipt.hash
        };
      });

      return {
        ...state,
        transactions,
        currentTxIndex: next(state.currentTxIndex),
        nextInFlow: true
      };
    }
    case 'CONFIRM_TX_REQUEST': {
      return {
        ...state
      };
    }
    case 'CONFIRM_TX_SUCCESS': {
      const { receipt } = payload;
      const transactions = state.transactions.map(t => {
        if (t.txHash !== receipt.transactionHash) return t;
        return {
          ...t,
          status: ITxStatus.CONFIRMED
        };
      });
      return {
        ...state,
        transactions
      };
    }
    case SwapFlowReducer.actionTypes.HALT_FLOW: {
      return { ...state, nextInFlow: false };
    }
    default:
      return state;
  }
}
SwapFlowReducer.actionTypes = {
  SEND_TX_SUCCESS: 'SEND_TX_SUCCESS',
  SEND_TX_REQUEST: 'SEND_TX_REQUEST',
  SEND_TX_FAILURE: 'SEND_TX_FAILURE',
  CONFIRM_TX_SUCCESS: 'CONFIRM_TX_SUCCESS',
  CONFIRM_TX_REQUEST: 'CONFIRM_TX_REQUEST',
  CONFIRM_TX_FAILURE: 'CONFIRM_TX_FAILURE',
  SIGN_FAILURE: 'SIGN_FAILURE',
  SIGN_SUCCESS: 'SIGN_SUCCESS',
  SIGN_REQUEST: 'SIGN_REQUEST',
  FETCH_TRADE_FAILURE: 'FETCH_TRADE_FAILURE',
  FETCH_TRADE_SUCCESS: 'FETCH_TRADE_SUCCESS',
  FETCH_TRADE_ERROR: 'FETCH_TRADE_ERROR',
  HALT_FLOW: 'HALT_FLOW'
};
