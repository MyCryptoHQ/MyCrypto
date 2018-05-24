import {
  TRANSACTIONS,
  FetchTransactionDataAction,
  SetTransactionDataAction,
  AddRecentTransactionAction,
  TransactionsAction,
  TransactionsState
} from './types';

export const INITIAL_STATE: TransactionsState = {
  txData: {},
  recent: []
};

function fetchTxData(
  state: TransactionsState,
  action: FetchTransactionDataAction
): TransactionsState {
  return {
    ...state,
    txData: {
      ...state.txData,
      [action.payload]: {
        data: null,
        receipt: null,
        error: null,
        isLoading: true
      }
    }
  };
}

function setTxData(state: TransactionsState, action: SetTransactionDataAction): TransactionsState {
  return {
    ...state,
    txData: {
      ...state.txData,
      [action.payload.txhash]: {
        data: action.payload.data,
        receipt: action.payload.receipt,
        error: action.payload.error,
        isLoading: false
      }
    }
  };
}

function resetTxData(state: TransactionsState): TransactionsState {
  return {
    ...state,
    txData: INITIAL_STATE.txData
  };
}

function addRecentTx(
  state: TransactionsState,
  action: AddRecentTransactionAction
): TransactionsState {
  return {
    ...state,
    recent: [action.payload, ...state.recent].slice(0, 50)
  };
}

export function transactionsReducer(
  state: TransactionsState = INITIAL_STATE,
  action: TransactionsAction
): TransactionsState {
  switch (action.type) {
    case TRANSACTIONS.FETCH_TRANSACTION_DATA:
      return fetchTxData(state, action);
    case TRANSACTIONS.SET_TRANSACTION_DATA:
      return setTxData(state, action);
    case TRANSACTIONS.RESET_TRANSACTION_DATA:
      return resetTxData(state);
    case TRANSACTIONS.ADD_RECENT_TRANSACTION:
      return addRecentTx(state, action);
    default:
      return state;
  }
}
