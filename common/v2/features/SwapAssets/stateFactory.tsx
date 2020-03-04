import { useContext } from 'react';

import { TUseStateReducerFactory, fromTxReceiptObj } from 'v2/utils';
import { ProviderHandler, AssetContext, NetworkContext } from 'v2/services';
import { ITxConfig } from 'v2/types';
import { isWeb3Wallet } from 'v2/utils/web3';

import { ISwapAsset, SwapState } from './types';
import {
  makeTxConfigFromTransaction,
  makeTradeTransactionFromDexTrade,
  makeTxObject
} from './helpers';

const swapFlowInitialState = {
  account: undefined,
  isSubmitting: false,
  txConfig: undefined,
  rawTransaction: undefined,
  dexTrade: undefined,
  txReceipt: undefined,
  initialToAmount: undefined,
  exchangeRate: undefined,
  markup: undefined
};

const SwapFlowFactory: TUseStateReducerFactory<SwapState> = ({ state, setState }) => {
  const { assets: userAssets } = useContext(AssetContext);
  const { networks } = useContext(NetworkContext);

  const saveTxConfig = (
    txConfig: ITxConfig,
    fromAsset: ISwapAsset,
    fromAmount: string,
    dexTrade: any
  ) => {
    setState(prevState => ({
      ...prevState,
      txConfig,
      fromAsset,
      fromAmount,
      dexTrade,
      account: txConfig.senderAccount
    }));
  };

  const handleConfirmSwapClicked = async (after: () => void): Promise<void> => {
    try {
      setState((prevState: SwapState) => ({
        ...prevState,
        isSubmitting: false,
        rawTransaction: makeTxObject(prevState.txConfig)
      }));

      after();
    } catch (e) {
      setState((prevState: SwapState) => ({
        ...prevState,
        isSubmitting: false
      }));
      console.error(e);
    }
  };

  const handleAllowanceSigned = async (signResponse: any, after: () => void) => {
    const { fromAsset, fromAmount, account, dexTrade } = state;
    let allowanceTxHash;
    const provider = new ProviderHandler(account.network);

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

    // wait for allowance tx to be mined
    setState((prevState: SwapState) => ({
      ...prevState,
      isSubmitting: true
    }));
    await provider.waitForTransaction(allowanceTxHash);
    const rawTransaction = await makeTradeTransactionFromDexTrade(dexTrade, account);
    const txConfig = makeTxConfigFromTransaction(userAssets)(
      rawTransaction,
      account,
      fromAsset,
      fromAmount
    );
    setState((prevState: SwapState) => ({
      ...prevState,
      isSubmitting: false,
      txConfig,
      rawTransaction
    }));

    after();
  };

  const handleTxSigned = async (signResponse: any, after: () => void) => {
    const { account, txConfig } = state;

    if (isWeb3Wallet(account.wallet)) {
      const txReceipt =
        signResponse && signResponse.hash ? signResponse : { ...txConfig, hash: signResponse };
      setState((prevState: SwapState) => ({
        ...prevState,
        txReceipt
      }));

      after();
    } else {
      const provider = new ProviderHandler(account.network);
      provider
        .sendRawTx(signResponse)
        .then(retrievedTxReceipt => retrievedTxReceipt)
        .catch(hash => provider.getTransactionByHash(hash))
        .then(retrievedTransactionReceipt => {
          const txReceipt = fromTxReceiptObj(retrievedTransactionReceipt)(userAssets, networks);
          setState((prevState: SwapState) => ({
            ...prevState,
            txReceipt
          }));
        })
        .finally(after);
    }
  };

  return {
    handleConfirmSwapClicked,
    handleAllowanceSigned,
    handleTxSigned,
    saveTxConfig,
    swapState: state
  };
};

export { swapFlowInitialState, SwapFlowFactory };
