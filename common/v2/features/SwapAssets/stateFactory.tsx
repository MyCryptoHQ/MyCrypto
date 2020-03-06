import { fromTxReceiptObj } from 'v2/utils';
import { ProviderHandler, DexService } from 'v2/services';
import { ITxConfig, TAction } from 'v2/types';
import { isWeb3Wallet } from 'v2/utils/web3';

import { SwapState, IAssetPair, LAST_CHANGED_AMOUNT } from './types';
import { makeTxConfigFromTransaction, makeTxObject } from './helpers';

export const swapFlowInitialState = {
  account: undefined,
  isSubmitting: false,
  txConfig: undefined,
  rawTransaction: undefined,
  txReceipt: undefined
};

type SFAction = TAction<any, any, any>;
export const SwapFlowReducer = (
  state: SwapState,
  { type, payload, error }: SFAction
): SwapState => {
  switch (type) {
    case 'TRADE_INFO_REQUEST': {
      return {
        ...state,
        isSubmitting: true
      };
    }
    case 'TRADE_INFO_SUCCESS': {
      const { txConfig, tradeOrder, assetPair } = payload;
      return {
        ...state,
        txConfig,
        assetPair,
        tradeOrder,
        account: txConfig.senderAccount,
        isSubmitting: false
      };
    }
    case 'CONFIRM_REQUEST': {
      return {
        ...state,
        isSubmitting: false,
        rawTransaction: makeTxObject(state.txConfig)
      };
    }
    case 'CONFIRM_FAILURE': {
      return {
        ...state,
        isSubmitting: false
      };
    }
    case 'SEND_TX_REQUEST': {
      const { txHash } = payload;
      return {
        ...state,
        txHash,
        isSubmitting: true
      };
    }
    case 'SEND_TX_SUCCESS': {
      const { txConfig, rawTransaction } = payload;
      return {
        ...state,
        txConfig,
        rawTransaction
      };
    }
    default:
      return state;
  }
};

export const saveTxConfig = (dispatch, _, after) => async (
  userAssets,
  assetPair: IAssetPair,
  account
) => {
  const { lastChangedAmount, fromAsset, fromAmount, toAsset, toAmount } = assetPair;
  const isLastChangedTo = lastChangedAmount === LAST_CHANGED_AMOUNT.TO;

  const getOrderDetails = isLastChangedTo
    ? DexService.instance.getOrderDetailsTo
    : DexService.instance.getOrderDetailsFrom;

  try {
    dispatch({
      type: 'TRADE_INFO_REQUEST'
    });
    const transactions = await getOrderDetails(
      fromAsset.symbol,
      toAsset.symbol,
      isLastChangedTo ? toAmount : fromAmount
    );

    const txConfig: ITxConfig = makeTxConfigFromTransaction(userAssets)(
      transactions[0],
      account,
      fromAsset,
      fromAmount
    );

    dispatch({
      type: 'TRADE_INFO_SUCCESS',
      payload: {
        txConfig,
        assetPair,
        tradeOrder: {
          isMultiTx: transactions.length > 1,
          transactions
        }
      }
    });
    after();
  } catch (err) {
    throw new Error(err);
  }
};

export const handleConfirmSwapClicked = dispatch => async (after: () => void): Promise<void> => {
  try {
    dispatch({ type: 'CONFIRM_REQUEST' });
    after();
  } catch (e) {
    dispatch({ type: 'CONFIRM_FAILURE' });
    console.error(e);
  }
};

export const handleApproveSigned = (dispatch, getState) => async (
  userAssets,
  signResponse: any,
  after: () => void
) => {
  const { fromAsset, fromAmount, account, tradeOrder } = getState();
  const provider = new ProviderHandler(account.network);
  let allowanceTxHash;
  try {
    if (isWeb3Wallet(account.wallet)) {
      allowanceTxHash = (signResponse && signResponse.hash) || signResponse;
    } else {
      const tx = await provider.sendRawTx(signResponse);
      allowanceTxHash = tx.hash;
    }
  } catch (hash) {
    const tx = await provider.getTransactionByHash(hash);
    allowanceTxHash = tx.hash;
  }
  dispatch({ type: 'SEND_TX_REQUEST', payload: { txHash: allowanceTxHash } });

  try {
    // wait for allowance tx to be mined
    // await provider.waitForTransaction(allowanceTxHash);
    const rawTransaction = tradeOrder.transactions[1];
    const txConfig = makeTxConfigFromTransaction(userAssets)(
      rawTransaction,
      account,
      fromAsset,
      fromAmount
    );
    dispatch({
      type: 'SEND_TX_SUCCESS ',
      payload: {
        txConfig,
        rawTransaction
      }
    });

    after();
  } catch (err) {
    throw new Error(err);
  }
};

export const handleTxSigned = (dispatch, getState) => async (
  userAssets,
  networks,
  signResponse: any,
  after: () => void
) => {
  const { account, txConfig } = getState;
  if (isWeb3Wallet(account.wallet)) {
    const txReceipt =
      signResponse && signResponse.hash ? signResponse : { ...txConfig, hash: signResponse };

    dispatch({
      type: 'SET_RECEIPT',
      payload: { txReceipt }
    });

    after();
  } else {
    const provider = new ProviderHandler(account.network);
    provider
      .sendRawTx(signResponse)
      .then(retrievedTxReceipt => retrievedTxReceipt)
      .catch(hash => provider.getTransactionByHash(hash))
      .then(retrievedTransactionReceipt => {
        const txReceipt = fromTxReceiptObj(retrievedTransactionReceipt)(userAssets, networks);
        dispatch({ type: 'SET_RECEIPT', payload: { txReceipt } });
      })
      .finally(after);
  }
};
