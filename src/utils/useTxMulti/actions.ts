import { Dispatch } from 'react';

import { TransactionResponse } from 'ethers/providers';

import { ProviderHandler } from '@services';
import { appendGasLimit, appendNonce, ERC20 } from '@services/EthService';
import {
  ITxHash,
  ITxObject,
  ITxSigned,
  ITxType,
  Network,
  StoreAccount,
  TStateGetter
} from '@types';
import { bigify, isTxHash, isTxSigned, isWeb3Wallet } from '@utils';
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
  getTxs: () => Promise<(ITxObject & { type: ITxType })[]>,
  account: StoreAccount,
  network: Network
) => {
  dispatch({ type: ActionTypes.INIT_REQUEST });
  try {
    const txs = await getTxs();
    const filteredTxs = await filterAsync(txs, async (tx) => {
      if (network && tx.type === ITxType.APPROVAL && tx.from) {
        try {
          const { _spender, _value } = ERC20.approve.decodeInput(tx.data);
          const provider = new ProviderHandler(network);
          const allowance = await provider.getTokenAllowance(tx.to, tx.from, _spender);
          // If allowance is less than the value being sent, the approval is needed
          return bigify(allowance).lt(bigify(_value));
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
