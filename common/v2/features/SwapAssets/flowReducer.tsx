import { Dispatch, Reducer } from 'react';
import { Optional } from 'utility-types';

import { isWeb3Wallet, fromTxReceiptObj } from 'v2/utils';
import { ProviderHandler, DexService } from 'v2/services';
import {
  ITxConfig,
  TAction,
  ExtendedAsset,
  StoreAccount,
  Network,
  ITxStatus,
  ITxObject
} from 'v2/types';

import { SwapState, IAssetPair, LAST_CHANGED_AMOUNT } from './types';
import {
  makeTxConfigFromTransaction,
  appendSender,
  appendGasPrice,
  appendGasLimit,
  appendNonce
} from './helpers';

export const swapFlowInitialState = {
  isSubmitting: false,
  currentTxIndex: 0,
  nextInFlow: false,
  transactions: []
};

type SFAction = TAction<any, any, any>;
type TStateGetter = () => SwapState;

export const SwapFlowReducer: Reducer<SwapState, SFAction> = (
  state,
  { type, payload, error }
): SwapState => {
  switch (type) {
    case 'TRADE_INFO_REQUEST': {
      return {
        ...state,
        isSubmitting: true
      };
    }
    case 'TRADE_INFO_SUCCESS': {
      const { formattedTxs, account, assetPair } = payload;
      const transactions = formattedTxs.map((tx: ITxObject, idx: number) => ({
        rawTx: tx,
        txHash: undefined,
        status: ITxStatus.READY,
        queuePos: idx
      }));
      return {
        ...state,
        assetPair,
        account,
        transactions,
        isSubmitting: false,
        currentTxIndex: 0,
        nextInFlow: true
      };
    }
    case 'TRADE_INFO_FAILURE': {
      return {
        ...state,
        isSubmitting: false,
        error
      };
    }
    case 'SIGN_REQUEST': {
      // update rawTx with gasLimit and nonce.
      const transactions = state.transactions.map(t => {
        if (t.queuePos !== state.currentTxIndex) return t;
        return {
          ...t,
          rawTx: payload.rawTx,
          status: ITxStatus.SIGNED
        };
      });
      return {
        ...state,
        isSubmitting: false,
        nextInFlow: true,
        transactions
      };
    }
    case 'SIGN_FAILURE': {
      return {
        ...state,
        isSubmitting: false,
        error
      };
    }
    case 'SEND_TX_REQUEST': {
      return {
        ...state,
        isSubmitting: true
      };
    }
    case 'SEND_TX_SUCCESS': {
      const { txReceipt } = payload;
      const next = (curr: number) => Math.min(curr + 1, state.transactions.length - 1);
      const transactions = state.transactions.map(t => {
        if (t.queuePos !== state.currentTxIndex) return t;
        return {
          ...t,
          status: ITxStatus.BROADCASTED,
          txReceipt,
          txHash: txReceipt.hash
        };
      });

      return {
        ...state,
        transactions,
        currentTxIndex: next(state.currentTxIndex),
        nextInFlow: true
      };
    }
    case 'HALT_FLOW': {
      return { ...state, nextInFlow: false };
    }
    default:
      return state;
  }
};

export const currentTx = (state: SwapState) => state.transactions[state.currentTxIndex] || {};

export const getTradeOrder = (dispatch: Dispatch<SFAction>) => async (
  assetPair: IAssetPair,
  account: StoreAccount
) => {
  const { lastChangedAmount, fromAsset, fromAmount, toAsset, toAmount } = assetPair;
  const { address, network } = account;
  const isLastChangedTo = lastChangedAmount === LAST_CHANGED_AMOUNT.TO;

  // Trade order details depends on the direction of the asset exchange.
  const getOrderDetails = isLastChangedTo
    ? DexService.instance.getOrderDetailsTo
    : DexService.instance.getOrderDetailsFrom;

  try {
    dispatch({ type: 'TRADE_INFO_REQUEST' });
    const formattedTxs: Optional<ITxObject, 'nonce' | 'gasLimit'>[] = await getOrderDetails(
      fromAsset.symbol,
      toAsset.symbol,
      (isLastChangedTo ? toAmount : fromAmount).toString()
    )
      .then(txs => Promise.all(txs.map(appendSender(address))))
      .then(txs => Promise.all(txs.map(appendGasPrice(network))));

    dispatch({
      type: 'TRADE_INFO_SUCCESS',
      payload: { account, assetPair, formattedTxs }
    });
  } catch (err) {
    dispatch({ type: 'TRADE_INFO_FAILURE' });
    throw new Error(err);
  }
};

export const confirmSend = (dispatch: Dispatch<SFAction>, getState: TStateGetter) => async (
  tx: Partial<ITxObject>
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

export const handleTxSigned = (dispatch: Dispatch<SFAction>, getState: TStateGetter) => async (
  userAssets: ExtendedAsset[],
  networks: Network[],
  signResponse: any
) => {
  const { account, assetPair, transactions } = getState();

  const txConfig: ITxConfig = makeTxConfigFromTransaction(userAssets)(
    transactions[0].rawTx,
    account!,
    assetPair!.fromAsset,
    assetPair!.fromAmount.toString()
  );

  if (isWeb3Wallet(account!.wallet)) {
    const txReceipt =
      signResponse && signResponse.hash ? signResponse : { ...txConfig, hash: signResponse };

    dispatch({ type: 'SEND_TX_SUCCESS', payload: { txReceipt } });
  } else {
    const provider = new ProviderHandler(account!.network);
    provider
      .sendRawTx(signResponse)
      .catch(hash => provider.getTransactionByHash(hash))
      .then(retrievedTxReceipt => {
        const txReceipt = fromTxReceiptObj(retrievedTxReceipt)(userAssets, networks);
        dispatch({ type: 'SEND_TX_SUCCESS', payload: { txReceipt } });
      });
  }
};
