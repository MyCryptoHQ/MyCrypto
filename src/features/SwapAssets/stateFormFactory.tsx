import axios from 'axios';

import { MYC_DEX_COMMISSION_RATE } from '@config';
import { checkRequiresApproval } from '@helpers';
import { DexAsset, DexService, getGasEstimate } from '@services';
import { selectNetwork, useSelector } from '@store';
import translate from '@translations';
import { ISwapAsset, ITxGasLimit, Network, NetworkId, StoreAccount } from '@types';
import {
  bigify,
  divideBNFloats,
  formatErrorEmailMarkdown,
  generateAssetUUID,
  inputGasLimitToHex,
  multiplyBNFloats,
  TUseStateReducerFactory,
  withCommission
} from '@utils';

import { LAST_CHANGED_AMOUNT, SwapFormState } from './types';

const swapFormInitialState = {
  selectedNetwork: 'Ethereum',
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

const BASE_ASSET_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

const SwapFormFactory: TUseStateReducerFactory<SwapFormState> = ({ state, setState }) => {
  const network = useSelector(selectNetwork(state.selectedNetwork)) as Network;

  const setNetwork = (network: NetworkId) => {
    setState((prevState: SwapFormState) => ({
      ...prevState,
      selectedNetwork: network
    }));
  };

  const fetchSwapAssets = async () => {
    try {
      const assets = await DexService.instance.getTokenList();
      if (assets.length < 1) return;
      // sort assets alphabetically
      const newAssets = assets
        .map(({ symbol, decimals, ...asset }: DexAsset) => ({
          ...asset,
          ticker: symbol,
          decimal: decimals,
          uuid:
            asset.address === BASE_ASSET_ADDRESS
              ? generateAssetUUID(network.chainId)
              : generateAssetUUID(network.chainId, asset.address)
        }))
        .sort((asset1: ISwapAsset, asset2: ISwapAsset) =>
          (asset1.ticker as string).localeCompare(asset2.ticker)
        );
      // set fromAsset to default (ETH)
      const fromAsset = newAssets.find((x) => x.address === BASE_ASSET_ADDRESS);
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
        account?.address,
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
        account?.address,
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

        const { type, ...tx } = approvalTx;

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
    fetchSwapAssets,
    setSwapAssets,
    handleFromAssetSelected,
    handleToAssetSelected,
    calculateNewFromAmount,
    calculateNewToAmount,
    handleFromAmountChanged,
    handleToAmountChanged,
    handleAccountSelected,
    handleGasLimitEstimation,
    handleRefreshQuote,
    formState: state
  };
};

export { swapFormInitialState, SwapFormFactory };
