import { useContext } from 'react';

import translate from 'v2/translations';
import { TUseStateReducerFactory, fromTxReceiptObj, formatErrorEmailMarkdown } from 'v2/utils';
import {
  DexService,
  ProviderHandler,
  AssetContext,
  NetworkContext,
  getNetworkById
} from 'v2/services';
import { StoreAccount } from 'v2/types';
import { isWeb3Wallet } from 'v2/utils/web3';
import { DEFAULT_NETWORK } from 'v2/config';

import { ISwapAsset, LAST_CHANGED_AMOUNT, SwapState } from './types';
import {
  makeTxConfigFromTransaction,
  makeAllowanceTransaction,
  makeTradeTransactionFromDexTrade
} from './helpers';

const swapFlowInitialState = {
  assets: [],
  fromAsset: undefined,
  fromAmount: '',
  fromAmountError: undefined,
  isCalculatingFromAmount: false,
  toAsset: undefined,
  toAmount: '',
  toAmountError: undefined,
  isCalculatingToAmount: false,
  lastChangedAmount: LAST_CHANGED_AMOUNT.FROM,
  swapPrice: 0,
  account: undefined,
  isSubmitting: false,
  txConfig: undefined,
  rawTransaction: undefined,
  dexTrade: undefined,
  txReceipt: undefined
};

const SwapFlowFactory: TUseStateReducerFactory<SwapState> = ({ state, setState }) => {
  const { assets: userAssets } = useContext(AssetContext);
  const { networks } = useContext(NetworkContext);

  const fetchSwapAssets = async () => {
    try {
      const assets = await DexService.instance.getTokenList();
      if (assets.length < 1) return;
      // sort assets alphabetically
      assets.sort((asset1: ISwapAsset, asset2: ISwapAsset) =>
        (asset1.symbol as string).localeCompare(asset2.symbol)
      );
      // set fromAsset to default (ETH)
      const network = getNetworkById(DEFAULT_NETWORK, networks);
      const fromAsset = assets.find((x: ISwapAsset) => x.symbol === network.baseUnit);
      const toAsset = assets[0];
      return [assets, fromAsset, toAsset];
    } catch (e) {
      console.error(e);
    }
  };

  const setSwapAssets = (assets: ISwapAsset[], fromAsset: ISwapAsset, toAsset: ISwapAsset) => {
    setState((prevState: SwapState) => ({
      ...prevState,
      assets,
      fromAsset,
      toAsset
    }));
  };

  const handleFromAssetSelected = (fromAsset: ISwapAsset) => {
    const { isCalculatingFromAmount, isCalculatingToAmount } = state;
    if (isCalculatingFromAmount || isCalculatingToAmount) {
      return;
    }

    setState((prevState: SwapState) => ({
      ...prevState,
      fromAsset,
      fromAmount: '',
      fromAmountError: '',
      toAmount: '',
      toAmountError: ''
    }));
  };

  const handleToAssetSelected = (toAsset: ISwapAsset) => {
    setState((prevState: SwapState) => ({
      ...prevState,
      toAsset
    }));
  };

  const calculateNewFromAmount = async (value: string) => {
    const { fromAsset, toAsset } = state;
    if (!fromAsset || !toAsset) {
      return;
    }

    try {
      setState((prevState: SwapState) => ({
        ...prevState,
        isCalculatingFromAmount: true
      }));

      const price = Number(
        await DexService.instance.getTokenPriceTo(fromAsset.symbol, toAsset.symbol, value)
      );

      setState((prevState: SwapState) => ({
        ...prevState,
        isCalculatingFromAmount: false,
        fromAmount: (Number(value) * price).toString(),
        fromAmountError: '',
        toAmountError: '',
        swapPrice: price
      }));
    } catch (e) {
      if (!e.isCancel) {
        setState((prevState: SwapState) => ({
          ...prevState,
          isCalculatingFromAmount: false,
          toAmountError: translate('UNEXPECTED_ERROR', {
            $link: formatErrorEmailMarkdown('Swap Error', e)
          })
        }));
        console.error(e);
      }
    }
  };

  const calculateNewToAmount = async (value: string) => {
    const { fromAsset, toAsset } = state;
    if (!fromAsset || !toAsset) {
      return;
    }

    try {
      setState((prevState: SwapState) => ({
        ...prevState,
        isCalculatingToAmount: true,
        lastChangedAmount: LAST_CHANGED_AMOUNT.FROM
      }));

      const price = Number(
        await DexService.instance.getTokenPriceFrom(fromAsset.symbol, toAsset.symbol, value)
      );

      setState((prevState: SwapState) => ({
        ...prevState,
        isCalculatingToAmount: false,
        toAmount: (Number(value) * price).toString(),
        fromAmountError: '',
        toAmountError: '',
        swapPrice: price
      }));
    } catch (e) {
      if (!e.isCancel) {
        setState((prevState: SwapState) => ({
          ...prevState,
          isCalculatingToAmount: false,
          fromAmountError: translate('UNEXPECTED_ERROR', {
            $link: formatErrorEmailMarkdown('Swap Error', e)
          })
        }));
        console.error(e);
      }
    }
  };

  const handleFromAmountChanged = (fromAmount: string) => {
    setState((prevState: SwapState) => ({
      ...prevState,
      fromAmount,
      lastChangedAmount: LAST_CHANGED_AMOUNT.FROM,
      fromAmountError: '',
      toAmountError: ''
    }));
  };

  const handleToAmountChanged = (toAmount: string) => {
    setState((prevState: SwapState) => ({
      ...prevState,
      toAmount,
      lastChangedAmount: LAST_CHANGED_AMOUNT.TO,
      fromAmountError: '',
      toAmountError: ''
    }));
  };

  const handleAccountSelected = (account: StoreAccount) => {
    setState((prevState: SwapState) => ({
      ...prevState,
      account
    }));
  };

  const handleConfirmSwapClicked = async (after: () => void): Promise<void> => {
    const { lastChangedAmount, fromAsset, fromAmount, toAsset, toAmount, account } = state;
    const isLastChangedTo = lastChangedAmount === LAST_CHANGED_AMOUNT.TO;

    try {
      const getOrderDetails = isLastChangedTo
        ? DexService.instance.getOrderDetailsTo
        : DexService.instance.getOrderDetailsFrom;

      setState((prevState: SwapState) => ({
        ...prevState,
        isSubmitting: true
      }));

      const dexTrade = await getOrderDetails(
        fromAsset.symbol,
        toAsset.symbol,
        isLastChangedTo ? toAmount : fromAmount
      );

      const makeTransaction = dexTrade.metadata.input
        ? makeAllowanceTransaction
        : makeTradeTransactionFromDexTrade;
      const rawTransaction = await makeTransaction(dexTrade, account);

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
        rawTransaction,
        dexTrade
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
        signResponse && signResponse.hash
          ? signResponse
          : { hash: signResponse, asset: txConfig.asset };
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
    fetchSwapAssets,
    setSwapAssets,
    handleFromAssetSelected,
    handleToAssetSelected,
    calculateNewFromAmount,
    calculateNewToAmount,
    handleFromAmountChanged,
    handleToAmountChanged,
    handleAccountSelected,
    handleConfirmSwapClicked,
    handleAllowanceSigned,
    handleTxSigned,
    swapState: state
  };
};

export { swapFlowInitialState, SwapFlowFactory };
