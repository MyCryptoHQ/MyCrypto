import { State, RequestStatus } from './typings';
import { TypeKeys as TK } from 'actions/transaction';
import { ReducersMapObject, Action } from 'redux';
import { createReducerFromObj } from 'reducers/transaction/helpers';
const INITIAL_STATE: State = {
  gasEstimationStatus: null,
  getFromStatus: null,
  getNonceStatus: null
};

const getPostFix = (str: string) => {
  const arr = str.split('_');
  return arr[arr.length - 1];
};

const nextState = (field: keyof State) => (state: State, action: Action): State => ({
  ...state,
  [field]: RequestStatus[getPostFix(action.type)]
});

const reducerObj: ReducersMapObject = {
  [TK.ESTIMATE_GAS_REQUESTED]: nextState('gasEstimationStatus'),
  [TK.ESTIMATE_GAS_FAILED]: nextState('gasEstimationStatus'),
  [TK.ESTIMATE_GAS_SUCCEEDED]: nextState('gasEstimationStatus'),
  [TK.GET_FROM_REQUESTED]: nextState('getFromStatus'),
  [TK.GET_FROM_SUCCEEDED]: nextState('getFromStatus'),
  [TK.GET_FROM_FAILED]: nextState('getFromStatus'),
  [TK.GET_NONCE_REQUESTED]: nextState('getNonceStatus'),
  [TK.GET_NONCE_SUCCEEDED]: nextState('getNonceStatus'),
  [TK.GET_NONCE_FAILED]: nextState('getNonceStatus'),
  [TK.RESET]: _ => INITIAL_STATE
};

export const network = createReducerFromObj(reducerObj, INITIAL_STATE);
