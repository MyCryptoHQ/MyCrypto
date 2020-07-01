import { useContext } from 'react';
import { formatEther } from 'ethers/utils';

import translate from '@translations';
import {
  TUseStateReducerFactory,
  formatErrorEmailMarkdown,
  convertToBN,
  multiplyBNFloats,
  divideBNFloats,
  withCommission,
  calculateMarkup,
  trimBN,
  generateAssetUUID
} from '@utils';
import { DexService, NetworkContext, getNetworkById } from '@services';
import { StoreAccount, ISwapAsset } from '@types';
import {
  DEFAULT_NETWORK,
  MYC_DEXAG_COMMISSION_RATE,
  DEFAULT_NETWORK_CHAINID,
  DEFAULT_NETWORK_SYMBOL
} from '@config';

import { LAST_CHANGED_AMOUNT, SwapFormState } from './types';

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

  const fetchSwapAssets = async () => {
    try {
      const assets = await DexService.instance.getTokenList();
      if (assets.length < 1) return;
      // sort assets alphabetically
      const newAssets = assets
        .map((asset: any) => ({
          ...asset,
          uuid:
            asset.symbol === DEFAULT_NETWORK_SYMBOL
              ? generateAssetUUID(DEFAULT_NETWORK_CHAINID)
              : generateAssetUUID(DEFAULT_NETWORK_CHAINID, asset.address)
        }))
        .sort((asset1: ISwapAsset, asset2: ISwapAsset) =>
          (asset1.symbol as string).localeCompare(asset2.symbol)
        );
      // set fromAsset to default (ETH)
      const network = getNetworkById(DEFAULT_NETWORK, networks);
      const fromAsset = newAssets.find((x: ISwapAsset) => x.symbol === network.baseUnit);
      const toAsset = newAssets[0];
      return [newAssets, fromAsset, toAsset];
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
    formState: state
  };
};

export { swapFormInitialState, SwapFormFactory };
