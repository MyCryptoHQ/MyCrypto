import EthTx from 'ethereumjs-tx';
import * as txActions from 'actions/transaction';
import { TypeKeys } from 'actions/transaction/constants';
import { State, sign } from 'reducers/transaction/sign';

describe('sign reducer', () => {
  const INITIAL_STATE: State = {
    local: { signedTransaction: null },
    web3: { transaction: null },
    indexingHash: null,
    pending: false
  };
  it('should handle SIGN_TRANSACTION_REQUESTED', () => {
    const signTxRequestedAction: txActions.SignTransactionRequestedAction = {
      type: TypeKeys.SIGN_TRANSACTION_REQUESTED,
      payload: {} as EthTx
    };
    expect(sign(INITIAL_STATE, signTxRequestedAction)).toEqual({ ...INITIAL_STATE, pending: true });
  });

  it('should handle SIGN_LOCAL_TRANSACTION_SUCCEEDED', () => {
    const signedTransaction = new Buffer('test');
    const indexingHash = 'test';
    const signLocalTxSucceededAction: txActions.SignLocalTransactionSucceededAction = {
      type: TypeKeys.SIGN_LOCAL_TRANSACTION_SUCCEEDED,
      payload: { signedTransaction, indexingHash }
    };
    expect(sign(INITIAL_STATE, signLocalTxSucceededAction)).toEqual({
      ...INITIAL_STATE,
      pending: false,
      indexingHash,
      local: { signedTransaction }
    });
  });

  it('should handle SIGN_WEB3_TRANSACTION_SUCCEEDED', () => {
    const transaction = new Buffer('test');
    const indexingHash = 'test';
    const signWeb3TxSucceededAction: txActions.SignWeb3TransactionSucceededAction = {
      type: TypeKeys.SIGN_WEB3_TRANSACTION_SUCCEEDED,
      payload: { transaction, indexingHash }
    };
    expect(sign(INITIAL_STATE, signWeb3TxSucceededAction)).toEqual({
      ...INITIAL_STATE,
      pending: false,
      indexingHash,
      web3: { transaction }
    });
  });

  it('should reset', () => {
    const resetAction: txActions.ResetTransactionSuccessfulAction = {
      type: TypeKeys.RESET_SUCCESSFUL,
      payload: { isContractInteraction: false }
    };
    const modifiedState: State = {
      ...INITIAL_STATE,
      pending: true
    };
    expect(sign(modifiedState, resetAction)).toEqual(INITIAL_STATE);
  });
});
