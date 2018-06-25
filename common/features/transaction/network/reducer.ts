import { transactionFieldsTypes } from '../fields';
import * as transactionTypes from '../types';
import * as types from './types';

export const NETWORK_INITIAL_STATE: types.TransactionNetworkState = {
  gasEstimationStatus: null,
  getFromStatus: null,
  getNonceStatus: null,
  gasPriceStatus: null
};

const getPostFix = (str: string): keyof typeof types.RequestStatus => {
  const arr = str.split('_');
  return arr[arr.length - 1] as any;
};

const getNextState = (field: keyof types.TransactionNetworkState) => (
  state: types.TransactionNetworkState,
  action: types.TransactionNetworkAction
): types.TransactionNetworkState => ({
  ...state,
  [field]: types.RequestStatus[getPostFix(action.type)]
});

const setGasPriceStatus = (
  state: types.TransactionNetworkState,
  gasPriceStatus: types.RequestStatus
) => ({
  ...state,
  gasPriceStatus
});

const resetNetwork = () => NETWORK_INITIAL_STATE;

export function networkReducer(
  state: types.TransactionNetworkState = NETWORK_INITIAL_STATE,
  action:
    | types.TransactionNetworkAction
    | transactionTypes.ResetTransactionSuccessfulAction
    | transactionFieldsTypes.InputGasPriceAction
    | transactionFieldsTypes.InputGasPriceIntentAction
) {
  switch (action.type) {
    case types.TransactionNetworkActions.ESTIMATE_GAS_REQUESTED:
      return getNextState('gasEstimationStatus')(state, action);
    case types.TransactionNetworkActions.ESTIMATE_GAS_FAILED:
      return getNextState('gasEstimationStatus')(state, action);
    case types.TransactionNetworkActions.ESTIMATE_GAS_TIMEDOUT:
      return getNextState('gasEstimationStatus')(state, action);
    case types.TransactionNetworkActions.ESTIMATE_GAS_SUCCEEDED:
      return getNextState('gasEstimationStatus')(state, action);
    case types.TransactionNetworkActions.GET_FROM_REQUESTED:
      return getNextState('getFromStatus')(state, action);
    case types.TransactionNetworkActions.GET_FROM_SUCCEEDED:
      return getNextState('getFromStatus')(state, action);
    case types.TransactionNetworkActions.GET_FROM_FAILED:
      return getNextState('getFromStatus')(state, action);
    case types.TransactionNetworkActions.GET_NONCE_REQUESTED:
      return getNextState('getNonceStatus')(state, action);
    case types.TransactionNetworkActions.GET_NONCE_SUCCEEDED:
      return getNextState('getNonceStatus')(state, action);
    case types.TransactionNetworkActions.GET_NONCE_FAILED:
      return getNextState('getNonceStatus')(state, action);

    // Not exactly "network" requests, but we want to show pending while
    // gas price is subject to change
    case transactionFieldsTypes.TransactionFieldsActions.GAS_PRICE_INPUT_INTENT:
      return setGasPriceStatus(state, types.RequestStatus.REQUESTED);
    case transactionFieldsTypes.TransactionFieldsActions.GAS_PRICE_INPUT:
      return setGasPriceStatus(state, types.RequestStatus.SUCCEEDED);

    case transactionTypes.TransactionActions.RESET_SUCCESSFUL:
      return resetNetwork();
    default:
      return state;
  }
}
