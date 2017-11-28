import { State } from './typings';
import {
  TypeKeys as TK,
  SignTransactionSucceededAction
} from 'actions/transaction';
import { ReducersMapObject } from 'redux';
import { createReducerFromObj } from 'reducers/transaction/helpers';

const INITIAL_STATE: State = { signedTransaction: null };

const reducerObj: ReducersMapObject = {
  [TK.SIGN_TRANSACTION_SUCCEEDED]: (
    state: State,
    action: SignTransactionSucceededAction
  ) => ({ ...state, signedTransaction: action.payload }),
  [TK.SIGN_TRANSACTION_FAILED]: _ => INITIAL_STATE,
  [TK.RESET]: _ => INITIAL_STATE
};

export const signing = createReducerFromObj(reducerObj, INITIAL_STATE);
