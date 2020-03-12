import { Dispatch } from 'react';
import { Optional } from 'utility-types';

import { isWeb3Wallet } from 'v2/utils';
import { ProviderHandler, DexService } from 'v2/services';
import { StoreAccount, ITxObject } from 'v2/types';

import { TStateGetter, SFAction, SwapState, IAssetPair, LAST_CHANGED_AMOUNT } from './types';
import { appendSender, appendGasPrice, appendGasLimit, appendNonce } from './helpers';

export const currentTx = (state: SwapState) => state.transactions[state.currentTxIndex] || {};

export const getTradeOrder = (assetPair: IAssetPair, account: StoreAccount) => async (
  dispatch: Dispatch<SFAction>
): Promise<void> => {
  const { lastChangedAmount, fromAsset, fromAmount, toAsset, toAmount } = assetPair;
  const { address, network } = account;
  const isLastChangedTo = lastChangedAmount === LAST_CHANGED_AMOUNT.TO;

  // Trade order details depends on the direction of the asset exchange.
  const getOrderDetails = isLastChangedTo
    ? DexService.instance.getOrderDetailsTo
    : DexService.instance.getOrderDetailsFrom;

  try {
    dispatch({ type: 'FETCH_TRADE_REQUEST' });
    const formattedTxs: Optional<ITxObject, 'nonce' | 'gasLimit'>[] = await getOrderDetails(
      fromAsset.symbol,
      toAsset.symbol,
      (isLastChangedTo ? toAmount : fromAmount).toString()
    )
      .then(txs => Promise.all(txs.map(appendSender(address))))
      .then(txs => Promise.all(txs.map(appendGasPrice(network))));

    dispatch({
      type: 'FETCH_TRADE_SUCCESS',
      payload: { account, assetPair, formattedTxs }
    });
  } catch (err) {
    dispatch({ type: 'FETCH_TRADE_FAILURE' });
    throw new Error(err);
  }
};

export const confirmSend = (tx: Partial<ITxObject>) => async (
  dispatch: Dispatch<SFAction>,
  getState: TStateGetter
): Promise<void> => {
  const { account } = getState();
  try {
    const rawTx = await Promise.resolve(tx)
      .then(appendGasLimit(account!.network))
      .then(appendNonce(account!.network, account!.address));

    dispatch({ type: 'SIGN_REQUEST', payload: { rawTx } });
  } catch (e) {
    dispatch({ type: 'SIGN_FAILURE' });
    console.error(e);
  }
};

export const handleTxSigned = (signResponse: any) => async (
  dispatch: Dispatch<SFAction>,
  getState: TStateGetter
): Promise<void> => {
  const { account } = getState();

  const provider = new ProviderHandler(account!.network);

  if (isWeb3Wallet(account!.wallet)) {
    const txReceipt = signResponse;
    dispatch({ type: 'SEND_TX_SUCCESS', payload: { txReceipt } });
    waitForConfirmation(signResponse, provider)(dispatch);
  } else {
    provider
      .sendRawTx(signResponse)
      .then(txResponse => {
        dispatch({ type: 'SEND_TX_SUCCESS', payload: { txReceipt: txResponse } });
        return txResponse.hash;
      })
      .then(txHash => waitForConfirmation(txHash!, provider)(dispatch))
      .catch(err => {
        throw new Error(err);
      });
  }
};

const waitForConfirmation = (txHash: string, provider: ProviderHandler) => (
  dispatch: Dispatch<SFAction>
) => {
  dispatch({ type: 'CONFIRM_TX_REQUEST' });
  const poller = setInterval(async () => {
    try {
      const receipt = await provider.getTransactionReceipt(txHash);
      if (!receipt) return;
      dispatch({ type: 'CONFIRM_TX_SUCCESS', payload: { receipt } });
      clearInterval(poller);
    } catch (err) {
      dispatch({ type: 'CONFIRM_TX_FAILURE', error: true, payload: { err } });
    }
  }, 2000);
};
