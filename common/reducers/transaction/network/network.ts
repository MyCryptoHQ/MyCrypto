import { State } from './typings';
import { TypeKeys as TK } from 'actions/transaction';
import { ReducersMapObject } from 'redux';
import { createReducerFromObj } from 'reducers/transaction/helpers';

const INITIAL_STATE: State = { gasEstimationSuccessful: true };

const reducerObj: ReducersMapObject = {
  [TK.ESTIMATE_GAS_SUCCEEDED]: (state: State) => ({
    ...state,
    gasEstimationSuccessful: true
  }),
  [TK.ESTIMATE_GAS_FAILED]: (state: State) => ({
    ...state,
    gasEstimationSuccessful: false
  }),
  [TK.RESET]: _ => INITIAL_STATE
};

export const network = createReducerFromObj(reducerObj, INITIAL_STATE);
