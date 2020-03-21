import { Dispatch } from 'react';
import { TransactionResponse } from 'ethers/providers';

import { ITxSigned, ITxObject, TStateGetter, StoreAccount, Network, ITxHash } from 'v2/types';
import { isWeb3Wallet } from 'v2/utils';
import { ProviderHandler } from 'v2/services';
import { appendGasLimit, appendNonce } from 'v2/services/EthService';

import { TxMultiState, TxMultiAction, ActionTypes } from './types';

export const init = (dispatch: Dispatch<TxMultiAction>) => async (
  txs: ITxObject[],
  account: StoreAccount,
  network: Network
) => {
  dispatch({
    type: ActionTypes.INIT_SUCCESS,
    payload: { txs, account, network }
  });
};

export const initWith = (dispatch: Dispatch<TxMultiAction>) => async (
  getTxs: () => any,
  account: StoreAccount,
  network: Network
) => {
  dispatch({ type: ActionTypes.INIT_REQUEST });
  try {
    const txs = await getTxs();
    dispatch({
      type: ActionTypes.INIT_SUCCESS,
      payload: {
        txs,
        account,
        network
      }
    });
  } catch (err) {
    dispatch({ type: ActionTypes.INIT_FAILURE, payload: err, error: true });
  }
};
export const stopYield = (dispatch: Dispatch<TxMultiAction>) => async () =>
  dispatch({ type: ActionTypes.HALT_FLOW });

export const prepareTx = (
  dispatch: Dispatch<TxMultiAction>,
  getState: TStateGetter<TxMultiState>
) => async (tx: ITxObject) => {
  const { network, account } = getState();
  dispatch({ type: ActionTypes.PREPARE_TX_REQUEST });

  try {
    const txRaw = await Promise.resolve(tx)
      .then(appendGasLimit(network!))
      .then(appendNonce(network!, account!.address));
    dispatch({ type: ActionTypes.PREPARE_TX_SUCCESS, payload: { txRaw } });
  } catch (err) {
    dispatch({ type: ActionTypes.PREPARE_TX_FAILURE, error: true, payload: err });
  }
};

const isTxSigned = (walletResponse: any): walletResponse is ITxSigned =>
  typeof walletResponse === 'string';

// aka: 0x9be781b4def0b764252ff6257a60129eea006b1dc9f657d715599ecff82e955f
const isTxHash = (walletResponse: any): walletResponse is ITxHash =>
  typeof walletResponse === 'string';

export const sendTx = (
  dispatch: Dispatch<TxMultiAction>,
  getState: TStateGetter<TxMultiState>
) => async (walletResponse: TransactionResponse | ITxHash | ITxSigned) => {
  const { account } = getState();
  dispatch({ type: ActionTypes.SEND_TX_REQUEST });

  if (isTxHash(walletResponse) && isWeb3Wallet(account!.wallet)) {
    dispatch({
      type: ActionTypes.SEND_TX_SUCCESS,
      payload: { txHash: walletResponse }
    });
    waitForConfirmation(dispatch, getState)(walletResponse);
  } else if (isTxSigned(walletResponse)) {
    const provider = new ProviderHandler(account!.network);
    console.warn('SENDTX', walletResponse);
    provider
      .sendRawTx(walletResponse)
      .then((txResponse: TransactionResponse) => {
        dispatch({
          type: ActionTypes.SEND_TX_SUCCESS,
          payload: { txHash: txResponse.hash as ITxHash }
        });
        return txResponse.hash;
      })
      .then((txHash: ITxHash) => waitForConfirmation(dispatch, getState)(txHash))
      .catch(err => {
        dispatch({ type: ActionTypes.SEND_TX_FAILURE, error: true, payload: err });
      });
  } else {
    throw new Error(`SendTx: unknown walletResponse ${walletResponse}`);
  }
};

const waitForConfirmation = (
  dispatch: Dispatch<TxMultiAction>,
  getState: TStateGetter<TxMultiState>
) => async (txHash: ITxHash) => {
  const { account } = getState();
  dispatch({ type: ActionTypes.CONFIRM_TX_REQUEST });
  const provider = new ProviderHandler(account!.network);
  try {
    const txReceipt = await provider.waitForTransaction(txHash);
    dispatch({ type: ActionTypes.CONFIRM_TX_SUCCESS, payload: { txReceipt } });
  } catch (err) {
    dispatch({
      type: ActionTypes.CONFIRM_TX_FAILURE,
      error: true,
      payload: err
    });
  }
};

export const reset = (dispatch: Dispatch<TxMultiAction>) => async () => {
  dispatch({ type: ActionTypes.RESET });
};
