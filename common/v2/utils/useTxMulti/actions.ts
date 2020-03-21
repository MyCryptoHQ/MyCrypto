import { Dispatch } from 'react';

import { ITxReceipt, ISignedTx, ITxObject, TStateGetter } from 'v2/types';
import { isWeb3Wallet } from 'v2/utils';
import { ProviderHandler } from 'v2/services';
import { appendGasLimit, appendNonce } from 'v2/services/EthService';

import { TxMultiState, TxMultiAction } from './types';
import { TxMultiReducer } from './reducer';

type ActionCreator = (
  dispatch: Dispatch<TxMultiAction>,
  getState: TStateGetter<TxMultiState>
) => (tx: ITxObject | ITxReceipt | ISignedTx) => Promise<void>;

export const prepareTx: ActionCreator = (dispatch, getState) => async (tx: ITxObject) => {
  const { network, account } = getState();
  dispatch({ type: 'PREPARE_TX_REQUEST' });

  try {
    const txRaw = await Promise.resolve(tx)
      .then(appendGasLimit(network))
      .then(appendNonce(network, account.address));
    dispatch({ type: TxMultiReducer.actionTypes.PREPARE_TX_SUCCESS, payload: { txRaw } });
  } catch (err) {
    dispatch({ type: TxMultiReducer.actionTypes.PREPARE_TX_FAILURE, error: true, payload: err });
  }
};

export const sendTx: ActionCreator = (dispatch, getState) => async (
  signedTx: ITxReceipt | ISignedTx
) => {
  // When we it's a web3 account, the wallet handles the sending directly.
  dispatch({
    type: TxMultiReducer.actionTypes.SEND_TX_REQUEST
  });
  const { account } = getState();
  if (isWeb3Wallet(account.wallet)) {
    dispatch({
      type: TxMultiReducer.actionTypes.SEND_TX_SUCCESS,
      payload: { txReceipt: signedTx }
    });
    waitForConfirmation(dispatch, getState)(signedTx);
  } else {
    const provider = new ProviderHandler(account.network);
    provider
      .sendRawTx(signedTx)
      .then(txReceipt => {
        dispatch({ type: TxMultiReducer.actionTypes.SEND_TX_SUCCESS, payload: { txReceipt } });
        return txReceipt.hash;
      })
      .then(txHash => waitForConfirmation(dispatch, getState)(txHash))
      .catch(err => {
        dispatch({ type: TxMultiReducer.actionTypes.SEND_TX_FAILURE, error: true, payload: err });
      });
  }
};

const waitForConfirmation: ActionCreator = (dispatch, getState) => async txHash => {
  const { account } = getState();
  dispatch({ type: TxMultiReducer.actionTypes.CONFIRM_TX_REQUEST });
  const provider = new ProviderHandler(account.network);
  try {
    const receipt = await provider.waitForTransaction(txHash);
    dispatch({ type: TxMultiReducer.actionTypes.CONFIRM_TX_SUCCESS, payload: { receipt } });
  } catch (err) {
    dispatch({
      type: TxMultiReducer.actionTypes.CONFIRM_TX_FAILURE,
      error: true,
      payload: { err }
    });
  }
};

export const reset: ActionCreator = dispatch => async () => {
  dispatch({ type: TxMultiReducer.actionTypes.RESET });
};
