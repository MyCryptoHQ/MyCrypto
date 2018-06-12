import { TRANSACTION, ResetTransactionSuccessfulAction } from '../types';
import { TRANSACTION_FIELDS, InputGasPriceAction, InputGasPriceIntentAction } from '../fields';
import { TRANSACTION_NETWORK, NetworkAction, RequestStatus } from '../network';

export interface NetworkState {
  gasEstimationStatus: RequestStatus | null;
  getFromStatus: RequestStatus | null;
  getNonceStatus: RequestStatus | null;
  gasPriceStatus: RequestStatus | null;
}

export const NETWORK_INITIAL_STATE: NetworkState = {
  gasEstimationStatus: null,
  getFromStatus: null,
  getNonceStatus: null,
  gasPriceStatus: null
};

const getPostFix = (str: string): keyof typeof RequestStatus => {
  const arr = str.split('_');
  return arr[arr.length - 1] as any;
};

const getNextState = (field: keyof NetworkState) => (
  state: NetworkState,
  action: NetworkAction
): NetworkState => ({
  ...state,
  [field]: RequestStatus[getPostFix(action.type)]
});

const setGasPriceStatus = (state: NetworkState, gasPriceStatus: RequestStatus) => ({
  ...state,
  gasPriceStatus
});

const resetNetwork = () => NETWORK_INITIAL_STATE;

export default function network(
  state: NetworkState = NETWORK_INITIAL_STATE,
  action:
    | NetworkAction
    | ResetTransactionSuccessfulAction
    | InputGasPriceAction
    | InputGasPriceIntentAction
) {
  switch (action.type) {
    case TRANSACTION_NETWORK.ESTIMATE_GAS_REQUESTED:
      return getNextState('gasEstimationStatus')(state, action);
    case TRANSACTION_NETWORK.ESTIMATE_GAS_FAILED:
      return getNextState('gasEstimationStatus')(state, action);
    case TRANSACTION_NETWORK.ESTIMATE_GAS_TIMEDOUT:
      return getNextState('gasEstimationStatus')(state, action);
    case TRANSACTION_NETWORK.ESTIMATE_GAS_SUCCEEDED:
      return getNextState('gasEstimationStatus')(state, action);
    case TRANSACTION_NETWORK.GET_FROM_REQUESTED:
      return getNextState('getFromStatus')(state, action);
    case TRANSACTION_NETWORK.GET_FROM_SUCCEEDED:
      return getNextState('getFromStatus')(state, action);
    case TRANSACTION_NETWORK.GET_FROM_FAILED:
      return getNextState('getFromStatus')(state, action);
    case TRANSACTION_NETWORK.GET_NONCE_REQUESTED:
      return getNextState('getNonceStatus')(state, action);
    case TRANSACTION_NETWORK.GET_NONCE_SUCCEEDED:
      return getNextState('getNonceStatus')(state, action);
    case TRANSACTION_NETWORK.GET_NONCE_FAILED:
      return getNextState('getNonceStatus')(state, action);

    // Not exactly "network" requests, but we want to show pending while
    // gas price is subject to change
    case TRANSACTION_FIELDS.GAS_PRICE_INPUT_INTENT:
      return setGasPriceStatus(state, RequestStatus.REQUESTED);
    case TRANSACTION_FIELDS.GAS_PRICE_INPUT:
      return setGasPriceStatus(state, RequestStatus.SUCCEEDED);

    case TRANSACTION.RESET_SUCCESSFUL:
      return resetNetwork();
    default:
      return state;
  }
}
