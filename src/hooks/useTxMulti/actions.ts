import { Dispatch } from 'react';

import { TransactionResponse } from '@ethersproject/abstract-provider';

import { appendGasLimit, appendNonce, checkRequiresApproval } from '@helpers';
import { ProviderHandler } from '@services';
import {
  ITxHash,
  ITxObject,
  ITxSigned,
  ITxType,
  Network,
  StoreAccount,
  TStateGetter
} from '@types';
import { isTxHash, isTxSigned, isWeb3Wallet } from '@utils';
import { filterAsync } from '@utils/asyncFilter';

import { ActionTypes, TxMultiAction, TxMultiState } from './types';

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
  getTxs: () => Promise<(ITxObject & { txType: ITxType })[]>,
  account: StoreAccount,
  network: Network
) => {
  dispatch({ type: ActionTypes.INIT_REQUEST });
  try {
    const txs = await getTxs();
    const filteredTxs = await filterAsync(txs, async (tx) => {
      if (network && tx.txType === ITxType.APPROVAL && tx.from && tx.to) {
        try {
          return checkRequiresApproval(network, tx.to, tx.from, tx.data);
        } catch (err) {
          console.error(err);
        }
      }
      return true;
    });
    dispatch({
      type: ActionTypes.INIT_SUCCESS,
      payload: {
        txs: filteredTxs,
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

export const sendTx = (
  dispatch: Dispatch<TxMultiAction>,
  getState: TStateGetter<TxMultiState>
) => async (walletResponse: ITxHash | ITxSigned) => {
  const { account } = getState();
  dispatch({ type: ActionTypes.SEND_TX_REQUEST });
  const provider = new ProviderHandler(account!.network);
  if (isTxHash(walletResponse) && isWeb3Wallet(account!.wallet)) {
    provider.getTransactionByHash(walletResponse).then((txResponse: TransactionResponse) => {
      dispatch({
        type: ActionTypes.SEND_TX_SUCCESS,
        payload: { txHash: walletResponse, txResponse }
      });
      waitForConfirmation(dispatch, getState)(walletResponse);
    });
  } else if (isTxHash(walletResponse) || isTxSigned(walletResponse)) {
    provider
      .sendRawTx(walletResponse)
      .then((txResponse: TransactionResponse) => {
        dispatch({
          type: ActionTypes.SEND_TX_SUCCESS,
          payload: { txHash: txResponse.hash as ITxHash, txResponse }
        });
        return txResponse.hash;
      })
      .then((txHash: ITxHash) => waitForConfirmation(dispatch, getState)(txHash))
      .catch((err: Error) => {
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
    const minedAt = await provider
      .getBlockByNumber(txReceipt.blockNumber!)
      .then((block) => block.timestamp);
    dispatch({ type: ActionTypes.CONFIRM_TX_SUCCESS, payload: { txReceipt, minedAt } });
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
