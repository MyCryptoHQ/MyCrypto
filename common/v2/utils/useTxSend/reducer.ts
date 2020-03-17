import { ITxStatus } from 'v2/types';
import { TxSendAction, TxSendState } from './types';

export const initialState: TxSendState = {
  isProcessing: false,
  status: ITxStatus.EMPTY
};

function Reducer(state: TxSendState, { type, payload, error }: TxSendAction): TxSendState {
  switch (type) {
    case Reducer.actionTypes.PREPARE_TX_REQUEST: {
      return { ...state, isProcessing: true, status: ITxStatus.PREPARING };
    }
    case Reducer.actionTypes.PREPARE_TX_SUCCESS: {
      const { account, txRaw } = payload;
      return {
        ...state,
        isProcessing: false,
        txRaw,
        status: ITxStatus.READY,
        account
      };
    }
    case Reducer.actionTypes.PREPARE_TX_FAILURE: {
      return {
        ...state,
        isProcessing: false,
        status: ITxStatus.FAILED,
        ...(error && { error: payload })
      };
    }
    case Reducer.actionTypes.SEND_TX_REQUEST: {
      return {
        ...state,
        isProcessing: true,
        status: ITxStatus.SIGNED
      };
    }
    case Reducer.actionTypes.SEND_TX_SUCCESS: {
      const { txHash } = payload;
      return {
        ...state,
        txHash,
        isProcessing: false,
        status: ITxStatus.BROADCASTED
      };
    }
    case Reducer.actionTypes.SEND_TX_FAILURE: {
      return {
        ...state,
        isProcessing: false,
        status: ITxStatus.FAILED,
        ...(error && { error: payload })
      };
    }
    case Reducer.actionTypes.CONFIRM_TX_REQUEST: {
      return {
        ...state,
        isProcessing: true,
        status: ITxStatus.CONFIRMING
      };
    }
    case Reducer.actionTypes.CONFIRM_TX_SUCCESS: {
      const { txReceipt } = payload;
      return {
        ...state,
        txReceipt,
        status: ITxStatus.CONFIRMED
      };
    }
    case Reducer.actionTypes.CONFIRM_TX_FAILURE: {
      return {
        ...state,
        isProcessing: false,
        status: ITxStatus.FAILED,
        ...(error && { error: payload })
      };
    }
    case Reducer.actionTypes.RESET: {
      return initialState;
    }
    default:
      return state;
  }
}

Reducer.actionTypes = {
  RESET: 'RESET',

  PREPARE_TX_SUCCESS: 'PREPARE_TX_SUCCESS',
  PREPARE_TX_REQUEST: 'PREPARE_TX_REQUEST',
  PREPARE_TX_FAILURE: 'PREPARE_TX_FAILURE',

  SEND_TX_SUCCESS: 'SEND_TX_SUCCESS',
  SEND_TX_REQUEST: 'SEND_TX_REQUEST',
  SEND_TX_FAILURE: 'SEND_TX_FAILURE',

  CONFIRM_TX_SUCCESS: 'CONFIRM_TX_SUCCESS',
  CONFIRM_TX_REQUEST: 'CONFIRM_TX_REQUEST',
  CONFIRM_TX_FAILURE: 'CONFIRM_TX_FAILURE'
};

export default Reducer;
