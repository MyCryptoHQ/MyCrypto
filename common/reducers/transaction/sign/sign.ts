import { State } from './typings';
import {
  TypeKeys as TK,
  SignLocalTransactionSucceededAction,
  SignWeb3TransactionSucceededAction,
  SignAction,
  ResetAction
} from 'actions/transaction';

const INITIAL_STATE: State = {
  local: { signedTransaction: null },
  web3: { transaction: null },
  indexingHash: null,
  pending: false
};

const signLocalTransactionRequested = (): State => ({
  ...INITIAL_STATE,
  pending: true
});

const signLocalTransactionSucceeded = (
  _: State,
  { payload }: SignLocalTransactionSucceededAction
): State => ({
  indexingHash: payload.indexingHash,
  pending: false,

  local: { signedTransaction: payload.signedTransaction },
  web3: { transaction: null }
});

const signWeb3TranscationRequested = (
  _: State,
  { payload }: SignWeb3TransactionSucceededAction
): State => ({
  indexingHash: payload.indexingHash,
  pending: false,

  local: { signedTransaction: null },
  web3: { transaction: payload.transaction }
});

const signTransactionFailed = () => INITIAL_STATE;

const reset = () => INITIAL_STATE;

export const sign = (state: State = INITIAL_STATE, action: SignAction | ResetAction) => {
  switch (action.type) {
    case TK.SIGN_LOCAL_TRANSACTION_REQUESTED:
      return signLocalTransactionRequested();
    case TK.SIGN_LOCAL_TRANSACTION_SUCCEEDED:
      return signLocalTransactionSucceeded(state, action);
    case TK.SIGN_WEB3_TRANSACTION_SUCCEEDED:
      return signWeb3TranscationRequested(state, action);
    case TK.SIGN_TRANSACTION_FAILED:
      return signTransactionFailed();
    case TK.RESET:
      return reset();
    default:
      return state;
  }
};
