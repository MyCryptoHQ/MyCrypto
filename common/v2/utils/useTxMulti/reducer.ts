import * as R from 'ramda';
import { getUUID } from 'v2/utils';

import { ITxStatus } from 'v2/types';
import { TxMultiState, TxMultiAction } from './types';

export const initialState = {
  isSubmitting: false,
  _currentTxIdx: 0,
  _isInitialized: false,
  canYield: false,
  transactions: []
};

const formatTx = txRaw => ({
  txRaw,
  _uuid: getUUID(JSON.stringify(txRaw)),
  status: ITxStatus.PREPARING
});

export function TxMultiReducer(
  state: TxMultiState,
  { type, payload, error }: TxMultiAction
): TxMultiState {
  const Types = TxMultiReducer.actionTypes;
  switch (type) {
    case Types.INIT_REQUEST: {
      return {
        ...state,
        isSubmitting: true
      };
    }
    case Types.INIT_SUCCESS: {
      const { txs, account, network } = payload;
      return {
        ...state,
        _isInitialized: true,
        canYield: true,
        transactions: R.map(formatTx, txs),
        isSubmitting: false,
        account,
        network
      };
    }
    case Types.INIT_FAILURE: {
      return {
        ...state,
        isSubmitting: false,
        ...(error && { error: payload })
      };
    }
    case Types.PREPARE_TX_REQUEST: {
      const transactions = R.adjust(
        state._currentTxIdx,
        R.mergeLeft({ status: ITxStatus.PREPARING }),
        state.transactions
      );
      return {
        ...state,
        isSubmitting: true,
        transactions
      };
    }
    case Types.PREPARE_TX_SUCCESS: {
      const { txRaw } = payload;
      const transactions = R.adjust(
        state._currentTxIdx,
        R.mergeLeft({ txRaw, status: ITxStatus.READY }),
        state.transactions
      );
      return {
        ...state,
        _isInitialized: true,
        canYield: true,
        isSubmitting: false,
        transactions
      };
    }
    case Types.PREPARE_TX_FAILURE: {
      return {
        ...state,
        ...(error && { error: payload })
      };
    }
    case Types.SEND_TX_SUCCESS: {
      const { txReceipt } = payload;
      const transactions = R.adjust(
        state._currentTxIdx,
        R.mergeLeft({ txHash: txReceipt.hash, status: ITxStatus.BROADCASTED }),
        state.transactions
      );

      return {
        ...state,
        transactions,
        isSubmitting: false,
        canYield: true
      };
    }
    case Types.CONFIRM_TX_REQUEST: {
      return {
        ...state,
        isSubmitting: true
      };
    }
    case Types.CONFIRM_TX_SUCCESS: {
      const { receipt } = payload;
      const next = (curr: number) => Math.min(curr + 1, state.transactions.length - 1);
      const transactions = R.adjust(
        state._currentTxIdx,
        R.mergeLeft({ txReceipt: receipt, status: ITxStatus.CONFIRMED }),
        state.transactions
      );

      return {
        ...state,
        _currentTxIdx: next(state._currentTxIdx),
        transactions
      };
    }
    case Types.CONFIRM_TX_FAILURE: {
      return {
        ...state,
        isSubmitting: false,
        ...(error && { error: payload })
      };
    }
    case Types.HALT_FLOW: {
      return { ...state, canYield: false };
    }
    case Types.RESET: {
      return initialState;
    }
    default:
      return state;
  }
}
TxMultiReducer.actionTypes = {
  INIT_REQUEST: 'INIT_REQUEST',
  INIT_SUCCESS: 'INIT_SUCCESS',
  INIT_FAILURE: 'INIT_FAILURE',

  PREPARE_TX_REQUEST: 'PREPARE_TX_REQUEST',
  PREPARE_TX_SUCCESS: 'PREPARE_TX_SUCCESS',
  PREPARE_TX_FAILURE: 'PREPARE_TX_FAILURE',

  SEND_TX_SUCCESS: 'SEND_TX_SUCCESS',
  SEND_TX_REQUEST: 'SEND_TX_REQUEST',
  SEND_TX_FAILURE: 'SEND_TX_FAILURE',

  CONFIRM_TX_SUCCESS: 'CONFIRM_TX_SUCCESS',
  CONFIRM_TX_REQUEST: 'CONFIRM_TX_REQUEST',
  CONFIRM_TX_FAILURE: 'CONFIRM_TX_FAILURE',

  HALT_FLOW: 'HALT_FLOW',
  RESET: 'RESET'
};
