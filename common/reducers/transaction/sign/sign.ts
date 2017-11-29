import { State } from './typings';
import {
  TypeKeys as TK,
  SignLocalTransactionSucceededAction,
  SignWeb3TransactionSucceededAction
} from 'actions/transaction';
import { ReducersMapObject } from 'redux';
import { createReducerFromObj } from 'reducers/transaction/helpers';

const INITIAL_STATE: State = {
  local: { signedTransaction: null },
  web3: { transaction: null }
};

const reducerObj: ReducersMapObject = {
  [TK.SIGN_LOCAL_TRANSACTION_SUCCEEDED]: (
    _,
    action: SignLocalTransactionSucceededAction
  ): State => ({
    local: { signedTransaction: action.payload },
    web3: { transaction: null }
  }),
  [TK.SIGN_WEB3_TRANSACTION_SUCCEEDED]: (
    _,
    action: SignWeb3TransactionSucceededAction
  ): State => ({
    local: { signedTransaction: null },
    web3: { transaction: action.payload }
  }),
  [TK.SIGN_TRANSACTION_FAILED]: _ => INITIAL_STATE,
  [TK.RESET]: _ => INITIAL_STATE
};

export const sign = createReducerFromObj(reducerObj, INITIAL_STATE);
