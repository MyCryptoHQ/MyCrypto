import { useEffect } from 'react';

import axios from 'axios';

import { MYC_DEX_COMMISSION_RATE } from '@config';
import { checkRequiresApproval } from '@helpers';
import { DexService } from '@services/ApiService';
import { getGasEstimate } from '@services/ApiService/Gas';
import { getBaseAssetByNetwork, getSwapAssetsByNetwork, selectNetwork, useSelector } from '@store';
import translate from '@translations';
import { ISwapAsset, ITxGasLimit, Network, NetworkId, StoreAccount } from '@types';
import {
  bigify,
  divideBNFloats,
  formatErrorEmailMarkdown,
  inputGasLimitToHex,
  multiplyBNFloats,
  TUseStateReducerFactory,
  withCommission
} from '@utils';

import { LAST_CHANGED_AMOUNT, SwapFormState } from './types';

const swapFormInitialState = {
  selectedNetwork: 'Ethereum',
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
  const network = useSelector(selectNetwork(state.selectedNetwork)) as Network;
  const baseAsset = useSelector(getBaseAssetByNetwork(network));
  const assets = useSelector(getSwapAssetsByNetwork(state.selectedNetwork));
  const sortedAssets = assets.sort((asset1, asset2) => asset1.ticker.localeCompare(asset2.ticker));

  useEffect(() => {
    setState((prevState: SwapFormState) => ({
      ...prevState,
      fromAsset: baseAsset,
      toAsset: sortedAssets.filter((a) => a.uuid !== baseAsset.uuid)[0]
    }));
  }, [assets.length, network]);

  const setNetwork = (network: NetworkId) => {
    setState((prevState: SwapFormState) => ({
      ...prevState,
      selectedNetwork: network
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
    const { fromAsset, toAsset, isCalculatingFromAmount, account } = state;
    if (!fromAsset || !toAsset || isCalculatingFromAmount) {
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

    if (bigify(value).lte(0)) {
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

      const { price, sellAmount, ...rest } = await DexService.instance.getOrderDetailsTo(
        network,
        account,
        fromAsset,
        toAsset,
        value
      );

      setState((prevState: SwapFormState) => ({
        ...prevState,
        isCalculatingFromAmount: false,
        fromAmount: sellAmount.toString(),
        fromAmountError: '',
        toAmountError: '',
        exchangeRate: withCommission({
          amount: divideBNFloats(1, price),
          rate: MYC_DEX_COMMISSION_RATE
        }).toString(),
        ...rest
      }));
    } catch (e) {
      if (axios.isCancel(e)) {
        return;
      }
      console.error(e);
      setState((prevState: SwapFormState) => ({
        ...prevState,
        isCalculatingFromAmount: false,
        fromAmount: '',
        toAmountError:
          e.response?.data?.code && e.response.data.code === 109
            ? translate('SWAP_INSUFFICIENT_FUNDS')
            : translate('UNEXPECTED_ERROR', {
                $link: formatErrorEmailMarkdown('Swap Error', e)
              })
      }));
    }
  };

  const calculateNewToAmount = async (value: string) => {
    const { fromAsset, toAsset, isCalculatingToAmount, account } = state;
    if (!fromAsset || !toAsset || isCalculatingToAmount) {
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

    if (bigify(value).lte(0)) {
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

      const { price, buyAmount, ...rest } = await DexService.instance.getOrderDetailsFrom(
        network,
        account,
        fromAsset,
        toAsset,
        value
      );

      setState((prevState: SwapFormState) => ({
        ...prevState,
        isCalculatingToAmount: false,
        toAmount: buyAmount.toString(),
        fromAmountError: '',
        toAmountError: '',
        exchangeRate: withCommission({
          amount: multiplyBNFloats(1, price), // @todo Fix this
          rate: MYC_DEX_COMMISSION_RATE
        }).toString(),
        ...rest
      }));
    } catch (e) {
      if (axios.isCancel(e)) {
        return;
      }
      console.error(e);
      setState((prevState: SwapFormState) => ({
        ...prevState,
        isCalculatingToAmount: false,
        toAmount: '',
        fromAmountError:
          e.response?.data?.code && e.response.data.code === 109
            ? e.response.data.reason
            : translate('UNEXPECTED_ERROR', {
                $link: formatErrorEmailMarkdown('Swap Error', e)
              })
      }));
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

  const handleGasLimitEstimation = async () => {
    const { approvalTx, account } = state;
    if (approvalTx && account) {
      setState((prevState: SwapFormState) => ({
        ...prevState,
        isEstimatingGas: true
      }));

      try {
        const requiresApproval =
          approvalTx &&
          (await checkRequiresApproval(network, approvalTx.to!, account.address, approvalTx.data!));

        const { txType, ...tx } = approvalTx;

        const approvalGasLimit = inputGasLimitToHex(
          requiresApproval ? await getGasEstimate(network, tx!) : '0'
        ) as ITxGasLimit;

        setState((prevState: SwapFormState) => ({
          ...prevState,
          isEstimatingGas: false,
          approvalGasLimit
        }));
      } catch (err) {
        console.error(err);
        setState((prevState: SwapFormState) => ({
          ...prevState,
          isEstimatingGas: false,
          fromAmountError: translate('UNEXPECTED_ERROR', {
            $link: formatErrorEmailMarkdown('Swap Error', err)
          })
        }));
      }
    }
  };

  const handleRefreshQuote = () => {
    const { fromAmount, toAmount, lastChangedAmount } = state;
    if (lastChangedAmount === LAST_CHANGED_AMOUNT.FROM) {
      calculateNewToAmount(fromAmount);
    } else {
      calculateNewFromAmount(toAmount);
    }
  };

  return {
    setNetwork,
    handleFromAssetSelected,
    handleToAssetSelected,
    calculateNewFromAmount,
    calculateNewToAmount,
    handleFromAmountChanged,
    handleToAmountChanged,
    handleAccountSelected,
    handleGasLimitEstimation,
    handleRefreshQuote,
    formState: { ...state, assets: sortedAssets }
  };
};

export { swapFormInitialState, SwapFormFactory };
