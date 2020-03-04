import { useContext } from 'react';
import { formatEther } from 'ethers/utils';

import translate from 'v2/translations';
import {
  TUseStateReducerFactory,
  fromTxReceiptObj,
  formatErrorEmailMarkdown,
  convertToBN,
  multiplyBNFloats,
  divideBNFloats,
  withCommission,
  calculateMarkup,
  trimBN
} from 'v2/utils';
import {
  DexService,
  ProviderHandler,
  AssetContext,
  NetworkContext,
  getNetworkById
} from 'v2/services';
import { StoreAccount, ITxConfig } from 'v2/types';
import { isWeb3Wallet } from 'v2/utils/web3';
import { DEFAULT_NETWORK, MYC_DEXAG_COMMISSION_RATE } from 'v2/config';

import { ISwapAsset, LAST_CHANGED_AMOUNT, SwapState, SwapFormState } from './types';
import {
  makeTxConfigFromTransaction,
  makeAllowanceTransaction,
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

const swapFormInitialState = {
  assets: [],
  account: undefined,
  fromAsset: undefined,
  fromAmount: '',
  fromAmountError: undefined,
  isCalculatingFromAmount: false,
  toAsset: undefined,
  toAmount: '',
  toAmountError: undefined,
  isCalculatingToAmount: false,
  lastChangedAmount: LAST_CHANGED_AMOUNT.FROM
};

const SwapFormFactory: TUseStateReducerFactory<SwapFormState> = ({ state, setState }) => {
  const { networks } = useContext(NetworkContext);
  const { assets: userAssets } = useContext(AssetContext);

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
    setState((prevState: SwapFormState) => ({
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

    setState((prevState: SwapFormState) => ({
      ...prevState,
      fromAsset,
      fromAmount: '',
      fromAmountError: '',
      toAmount: '',
      toAmountError: ''
    }));
  };

  const handleToAssetSelected = (toAsset: ISwapAsset) => {
    setState((prevState: SwapFormState) => ({
      ...prevState,
      toAsset
    }));
  };

  const calculateNewFromAmount = async (value: string) => {
    const { fromAsset, toAsset } = state;
    if (!fromAsset || !toAsset) {
      return;
    }

    if (value.length === 0) {
      setState((prevState: SwapFormState) => ({
        ...prevState,
        toAmount: '',
        fromAmount: ''
      }));
      return;
    }

    if (parseFloat(value) <= 0) {
      setState((prevState: SwapFormState) => ({
        ...prevState,
        isCalculatingFromAmount: false,
        toAmountError: translate('SWAP_ZERO_VALUE')
      }));
      return;
    }

    try {
      setState((prevState: SwapFormState) => ({
        ...prevState,
        isCalculatingFromAmount: true
      }));

      const commissionIncreasedAmount = trimBN(
        withCommission({
          amount: convertToBN(Number(value)),
          rate: MYC_DEXAG_COMMISSION_RATE
        }).toString()
      );

      const { price, costBasis } = await DexService.instance.getTokenPriceTo(
        fromAsset.symbol,
        toAsset.symbol,
        commissionIncreasedAmount.toString()
      );

      setState((prevState: SwapFormState) => ({
        ...prevState,
        isCalculatingFromAmount: false,
        fromAmount: trimBN(
          formatEther(multiplyBNFloats(commissionIncreasedAmount, price).toString())
        ),
        fromAmountError: '',
        toAmountError: '',
        initialToAmount: commissionIncreasedAmount,
        exchangeRate: trimBN(formatEther(divideBNFloats(1, price).toString())),
        markup: calculateMarkup(
          parseFloat(trimBN(formatEther(divideBNFloats(1, price).toString()))),
          parseFloat(trimBN(formatEther(divideBNFloats(1, costBasis).toString())))
        )
      }));
    } catch (e) {
      if (!e.isCancel) {
        setState((prevState: SwapFormState) => ({
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

    if (value.length === 0) {
      setState((prevState: SwapFormState) => ({
        ...prevState,
        toAmount: '',
        fromAmount: ''
      }));
      return;
    }

    if (parseFloat(value) <= 0) {
      setState((prevState: SwapFormState) => ({
        ...prevState,
        isCalculatingToAmount: false,
        fromAmountError: translate('SWAP_ZERO_VALUE')
      }));
      return;
    }

    try {
      setState((prevState: SwapFormState) => ({
        ...prevState,
        isCalculatingToAmount: true,
        lastChangedAmount: LAST_CHANGED_AMOUNT.FROM
      }));

      const { price, costBasis } = await DexService.instance.getTokenPriceFrom(
        fromAsset.symbol,
        toAsset.symbol,
        value
      );

      setState((prevState: SwapFormState) => ({
        ...prevState,
        isCalculatingToAmount: false,
        toAmount: withCommission({
          amount: multiplyBNFloats(value, price),
          rate: MYC_DEXAG_COMMISSION_RATE,
          subtract: true
        }).toString(),
        fromAmountError: '',
        toAmountError: '',
        initialToAmount: trimBN(formatEther(multiplyBNFloats(value, price).toString())),
        exchangeRate: price.toString(),
        markup: calculateMarkup(price, costBasis)
      }));
    } catch (e) {
      if (!e.isCancel) {
        setState((prevState: SwapFormState) => ({
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
    setState((prevState: SwapFormState) => ({
      ...prevState,
      fromAmount,
      lastChangedAmount: LAST_CHANGED_AMOUNT.FROM,
      fromAmountError: '',
      toAmountError: ''
    }));
  };

  const handleToAmountChanged = (toAmount: string) => {
    setState((prevState: SwapFormState) => ({
      ...prevState,
      toAmount,
      lastChangedAmount: LAST_CHANGED_AMOUNT.TO,
      fromAmountError: '',
      toAmountError: ''
    }));
  };

  const handleAccountSelected = (account: StoreAccount) => {
    setState((prevState: SwapFormState) => ({
      ...prevState,
      account
    }));
  };

  const getTokexInfo = async (): Promise<ITxConfig> => {
    const { lastChangedAmount, fromAsset, fromAmount, toAsset, toAmount, account } = state;
    const isLastChangedTo = lastChangedAmount === LAST_CHANGED_AMOUNT.TO;

    const getOrderDetails = isLastChangedTo
      ? DexService.instance.getOrderDetailsTo
      : DexService.instance.getOrderDetailsFrom;

    try {
      const dexTrade = await getOrderDetails(
        fromAsset.symbol,
        toAsset.symbol,
        isLastChangedTo ? toAmount : fromAmount
      );

      const makeTransaction = dexTrade.metadata.input
        ? makeAllowanceTransaction
        : makeTradeTransactionFromDexTrade;

      const rawTransaction = await makeTransaction(dexTrade, account);

      setState(prevState => ({
        ...prevState,
        isMulti: dexTrade.metadata.input,
        dexTrade
      }));

      return makeTxConfigFromTransaction(userAssets)(
        rawTransaction,
        account,
        fromAsset,
        fromAmount
      );
    } catch (err) {
      throw new Error(err);
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
    getTokexInfo,
    formState: state
  };
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

export { swapFlowInitialState, SwapFlowFactory, swapFormInitialState, SwapFormFactory };
