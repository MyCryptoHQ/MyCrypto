import * as types from './types';

export const INITIAL_STATE: types.TransactionsState = {
  txData: {},
  recent: []
};

function fetchTxData(
  state: types.TransactionsState,
  action: types.FetchTransactionDataAction
): types.TransactionsState {
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
  state: types.TransactionsState,
  action: types.SetTransactionDataAction
): types.TransactionsState {
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

function resetTxData(state: types.TransactionsState): types.TransactionsState {
  return {
    ...state,
    txData: INITIAL_STATE.txData
  };
}

function addRecentTx(
  state: types.TransactionsState,
  action: types.AddRecentTransactionAction
): types.TransactionsState {
  return {
    ...state,
    recent: [action.payload, ...state.recent].slice(0, 50)
  };
}

export function transactionsReducer(
  state: types.TransactionsState = INITIAL_STATE,
  action: types.TransactionsAction
): types.TransactionsState {
  switch (action.type) {
    case types.TransactionsActions.FETCH_TRANSACTION_DATA:
      return fetchTxData(state, action);
    case types.TransactionsActions.SET_TRANSACTION_DATA:
      return setTxData(state, action);
    case types.TransactionsActions.RESET_TRANSACTION_DATA:
      return resetTxData(state);
    case types.TransactionsActions.ADD_RECENT_TRANSACTION:
      return addRecentTx(state, action);
    default:
      return state;
  }
}
