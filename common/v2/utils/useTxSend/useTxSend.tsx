import { Dispatch } from 'react';
import { useReducer } from 'reinspect';
import * as R from 'ramda';

import { ITxStatus, ITxObject } from 'v2/types';
import { isWeb3Wallet, getUUID } from 'v2/utils';
import { ProviderHandler } from 'v2/services';

import { appendGasLimit, appendNonce } from './helpers';
import { default as Reducer, initialState } from './reducer';
import { TxSendAction, TxSendState, TxSendActions } from './types';

const formatRawTx = (tx: ITxObject): TxSendState => ({
  _uuid: getUUID(JSON.stringify(tx)),
  txRaw: tx,
  isProcessing: false,
  status: ITxStatus.PREPARING
});

type ActionCreator = (d: Dispatch<TxSendAction>) => (...a: any) => Promise<void>;

// Keep thunks indepedant of state for better testing.
const prepareTx: ActionCreator = dispatch => async (tx, account) => {
  dispatch({ type: 'PREPARE_TX_REQUEST' });
  try {
    const txRaw = await Promise.resolve(tx)
      .then(appendGasLimit(account.network))
      .then(appendNonce(account.network, account.address));
    dispatch({ type: 'PREPARE_TX_SUCCESS', payload: { txRaw } });
  } catch (err) {
    dispatch({ type: 'PREPARE_TX_FAILURE', error: true, payload: err });
  }
};

const sendTx: ActionCreator = dispatch => async (signedTx, account) => {
  // When we it's a web3 account, the wallet handles the sending directly.
  if (isWeb3Wallet(account.wallet)) {
    dispatch({ type: 'SEND_TX_SUCCESS', payload: { txReceipt: signedTx } });
    // waitForConfirmation
  } else {
    const provider = new ProviderHandler(account.network);
    provider
      .sendRawTx(signedTx)
      .then(txReceipt => dispatch({ type: 'SEND_TX_SUCCESS', payload: { txReceipt } }))
      // waitForTransaction
      .catch(err => {
        throw new Error(err);
      });
  }
};

const waitForConfirmation: ActionCreator = dispatch => async (txHash, account) => {
  dispatch({ type: 'CONFIRM_TX_REQUEST' });
  const provider = new ProviderHandler(account.network);
  try {
    const receipt = await provider.waitForTransaction(txHash);
    dispatch({ type: 'CONFIRM_TX_SUCCESS', payload: { receipt } });
  } catch (err) {
    dispatch({ type: 'CONFIRM_TX_FAILURE', error: true, payload: { err } });
  }
};

const reset: ActionCreator = dispatch => async () => dispatch({ type: 'RESET' });

export function useTxSend(): { state: TxSendState } & TxSendActions {
  const [state, dispatch] = useReducer(Reducer, initialState, R.identity, 'TxSend');
  return {
    state,
    formatRawTx,
    prepareTx: prepareTx(dispatch),
    sendTx: sendTx(dispatch),
    waitForConfirmation: waitForConfirmation(dispatch),
    reset: reset(dispatch)
  };
}
