import * as transactionsTypes from './types';

export const INITIAL_STATE: transactionsTypes.TransactionsState = {
  txData: {},
  recent: []
};

function fetchTxData(
  state: transactionsTypes.TransactionsState,
  action: transactionsTypes.FetchTransactionDataAction
): transactionsTypes.TransactionsState {
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

function setTxData(
  state: transactionsTypes.TransactionsState,
  action: transactionsTypes.SetTransactionDataAction
): transactionsTypes.TransactionsState {
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

function resetTxData(
  state: transactionsTypes.TransactionsState
): transactionsTypes.TransactionsState {
  return {
    ...state,
    txData: INITIAL_STATE.txData
  };
}

function addRecentTx(
  state: transactionsTypes.TransactionsState,
  action: transactionsTypes.AddRecentTransactionAction
): transactionsTypes.TransactionsState {
  return {
    ...state,
    recent: [action.payload, ...state.recent].slice(0, 50)
  };
}

export function transactionsReducer(
  state: transactionsTypes.TransactionsState = INITIAL_STATE,
  action: transactionsTypes.TransactionsAction
): transactionsTypes.TransactionsState {
  switch (action.type) {
    case transactionsTypes.TransactionsActions.FETCH_TRANSACTION_DATA:
      return fetchTxData(state, action);
    case transactionsTypes.TransactionsActions.SET_TRANSACTION_DATA:
      return setTxData(state, action);
    case transactionsTypes.TransactionsActions.RESET_TRANSACTION_DATA:
      return resetTxData(state);
    case transactionsTypes.TransactionsActions.ADD_RECENT_TRANSACTION:
      return addRecentTx(state, action);
    default:
      return state;
  }
}
