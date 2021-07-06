import { TransactionResponse } from '@ethersproject/providers';

import { ITxHash, ITxMetadata, ITxObject, ITxStatus, ITxType } from '@types';
import { getUUID } from '@utils';
import { adjust, map, mergeLeft } from '@vendor';

import { ActionTypes, TxMultiAction, TxMultiState } from './types';

export const initialState = {
  isSubmitting: false,
  _currentTxIdx: 0,
  _isInitialized: false,
  canYield: false,
  transactions: []
};

const formatTx = ({
  label,
  txType,
  metadata,
  ...txRaw
}: ITxObject & { txType: ITxType; label: string; metadata: ITxMetadata }) => ({
  txRaw,
  _uuid: getUUID(JSON.stringify(txRaw)),
  status: ITxStatus.PREPARING,
  txType,
  label,
  metadata
});

export function TxMultiReducer(state: TxMultiState, action: TxMultiAction): TxMultiState {
  const { type, payload, error } = action;
  switch (type) {
    case ActionTypes.INIT_REQUEST: {
      return {
        ...state,
        isSubmitting: true
      };
    }
    case ActionTypes.INIT_SUCCESS: {
      const { txs, account, network } = payload;
      return {
        ...state,
        _isInitialized: true,
        canYield: true,
        transactions: map(formatTx, txs),
        isSubmitting: false,
        account,
        network
      };
    }
    case ActionTypes.INIT_FAILURE: {
      return {
        ...state,
        isSubmitting: false,
        ...(error && { error: payload })
      };
    }
    case ActionTypes.PREPARE_TX_REQUEST: {
      const transactions = adjust(
        state._currentTxIdx,
        mergeLeft({ status: ITxStatus.PREPARING }),
        state.transactions
      );
      return {
        ...state,
        isSubmitting: true,
        transactions
      };
    }
    case ActionTypes.PREPARE_TX_SUCCESS: {
      const { txRaw } = payload;
      const transactions = adjust(
        state._currentTxIdx,
        mergeLeft({ txRaw, status: ITxStatus.READY }),
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
    case ActionTypes.PREPARE_TX_FAILURE: {
      return {
        ...state,
        ...(error && { error: payload }),
        isSubmitting: false
      };
    }
    case ActionTypes.SEND_TX_SUCCESS: {
      const { txHash, txResponse }: { txHash: ITxHash; txResponse: TransactionResponse } = payload;
      const transactions = adjust(
        state._currentTxIdx,
        mergeLeft({ txHash, status: ITxStatus.BROADCASTED, txResponse }),
        state.transactions
      );

      return {
        ...state,
        transactions,
        isSubmitting: false,
        canYield: true
      };
    }
    case ActionTypes.CONFIRM_TX_REQUEST: {
      return {
        ...state,
        isSubmitting: true
      };
    }
    case ActionTypes.CONFIRM_TX_SUCCESS: {
      const { txReceipt, minedAt } = payload;
      const next = (curr: number) => Math.min(curr + 1, state.transactions.length - 1);
      const transactions = adjust(
        state._currentTxIdx,
        mergeLeft({
          txReceipt,
          minedAt,
          status: txReceipt.status === 1 ? ITxStatus.SUCCESS : ITxStatus.FAILED
        }),
        state.transactions
      );

      return {
        ...state,
        _currentTxIdx: next(state._currentTxIdx),
        transactions
      };
    }
    case ActionTypes.CONFIRM_TX_FAILURE: {
      return {
        ...state,
        isSubmitting: false,
        ...(error && { error: payload })
      };
    }
    case ActionTypes.HALT_FLOW: {
      return { ...state, canYield: false };
    }
    case ActionTypes.RESET: {
      return initialState;
    }
    default:
      return state;
  }
}
