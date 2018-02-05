import { State, RequestStatus } from './typings';
import {
  TypeKeys as TK,
  ResetAction,
  NetworkAction,
  InputGasPriceAction,
  InputGasPriceIntentAction
} from 'actions/transaction';
import { Action } from 'redux';

const INITIAL_STATE: State = {
  gasEstimationStatus: null,
  getFromStatus: null,
  getNonceStatus: null,
  gasPriceStatus: null
};

const getPostFix = (str: string) => {
  const arr = str.split('_');
  return arr[arr.length - 1];
};

const nextState = (field: keyof State) => (state: State, action: Action): State => ({
  ...state,
  [field]: RequestStatus[getPostFix(action.type)]
});

const setGasPriceStatus = (state: State, gasPriceStatus: RequestStatus) => ({
  ...state,
  gasPriceStatus
});

const reset = () => INITIAL_STATE;

export const network = (
  state: State = INITIAL_STATE,
  action: NetworkAction | ResetAction | InputGasPriceAction | InputGasPriceIntentAction
) => {
  switch (action.type) {
    case TK.ESTIMATE_GAS_REQUESTED:
      return nextState('gasEstimationStatus')(state, action);
    case TK.ESTIMATE_GAS_FAILED:
      return nextState('gasEstimationStatus')(state, action);
    case TK.ESTIMATE_GAS_TIMEDOUT:
      return nextState('gasEstimationStatus')(state, action);
    case TK.ESTIMATE_GAS_SUCCEEDED:
      return nextState('gasEstimationStatus')(state, action);
    case TK.GET_FROM_REQUESTED:
      return nextState('getFromStatus')(state, action);
    case TK.GET_FROM_SUCCEEDED:
      return nextState('getFromStatus')(state, action);
    case TK.GET_FROM_FAILED:
      return nextState('getFromStatus')(state, action);
    case TK.GET_NONCE_REQUESTED:
      return nextState('getNonceStatus')(state, action);
    case TK.GET_NONCE_SUCCEEDED:
      return nextState('getNonceStatus')(state, action);
    case TK.GET_NONCE_FAILED:
      return nextState('getNonceStatus')(state, action);

    // Not exactly "network" requests, but we want to show pending while
    // gas price is subject to change
    case TK.GAS_PRICE_INPUT_INTENT:
      return setGasPriceStatus(state, RequestStatus.REQUESTED);
    case TK.GAS_PRICE_INPUT:
      return setGasPriceStatus(state, RequestStatus.SUCCEEDED);

    case TK.RESET:
      return reset();
    default:
      return state;
  }
};
