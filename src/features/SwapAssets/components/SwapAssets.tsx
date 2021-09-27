import { ChangeEvent, useCallback, useEffect, useState } from 'react';

import debounce from 'lodash/debounce';
import styled from 'styled-components';

import {
  AccountSelector,
  AssetSelector,
  Body,
  Box,
  Button,
  DemoGatewayBanner,
  Icon,
  InlineMessage,
  InputField,
  LinkApp,
  NetworkSelector,
  PoweredByText,
  Tooltip
} from '@components';
import { DEX_NETWORKS } from '@config';
import { useRates } from '@services/Rates';
import {
  getBaseAssetByNetwork,
  getIsDemoMode,
  getSettings,
  getStoreAccounts,
  getUserAssets,
  selectNetwork,
  useSelector
} from '@store';
import { SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { Asset, ISwapAsset, Network, NetworkId, StoreAccount } from '@types';
import { bigify, getTimeDifference, sortByLabel, totalTxFeeToString, useInterval } from '@utils';

import { getAccountsWithAssetBalance, getUnselectedAssets } from '../helpers';
import { SwapFormState } from '../types';
import { SwapQuote } from './SwapQuote';

const StyledButton = styled(Button)`
  margin-top: 12px;
  width: 100%;
  && div {
    justify-content: center;
  }
`;

type Props = SwapFormState & {
  isSubmitting: boolean;
  txError?: CustomError;
  onSuccess(): void;
  handleFromAssetSelected(asset: ISwapAsset): void;
  handleToAssetSelected(asset: ISwapAsset): void;
  calculateNewFromAmount(value: string): Promise<void>;
  calculateNewToAmount(value: string): Promise<void>;
  handleFromAmountChanged(value: string): void;
  handleToAmountChanged(value: string): void;
  handleAccountSelected(account?: StoreAccount): void;
  handleGasLimitEstimation(): void;
  handleRefreshQuote(): void;
  handleFlipAssets(): void;
  setNetwork(network: NetworkId): void;
};

const SwapAssets = (props: Props) => {
  const {
    selectedNetwork,
    account,
    fromAmount,
    toAmount,
    fromAsset,
    toAsset,
    assets,
    isCalculatingFromAmount,
    isCalculatingToAmount,
    fromAmountError,
    toAmountError,
    txError,
    onSuccess,
    isSubmitting,
    handleFromAssetSelected,
    handleToAssetSelected,
    calculateNewFromAmount,
    calculateNewToAmount,
    handleFromAmountChanged,
    handleToAmountChanged,
    handleAccountSelected,
    handleGasLimitEstimation,
    handleRefreshQuote,
    handleFlipAssets,
    approvalTx,
    exchangeRate,
    approvalGasLimit,
    tradeGasLimit,
    gasPrice,
    isEstimatingGas,
    expiration,
    setNetwork
  } = props;

  const settings = useSelector(getSettings);
  const isDemoMode = useSelector(getIsDemoMode);
  const network = useSelector(selectNetwork(selectedNetwork));
  const baseAsset = useSelector(getBaseAssetByNetwork(network));

  const [isExpired, setIsExpired] = useState(false);
  const accounts = useSelector(getStoreAccounts);
  const { getAssetRate } = useRates();

  const userAssets = useSelector(getUserAssets);

  const baseAssetRate = getAssetRate(baseAsset);
  const fromAssetRate = fromAsset && getAssetRate(fromAsset as Asset);

  // show only unused assets and assets owned by the user
  const filteredAssets = getUnselectedAssets(assets, fromAsset, toAsset);
  const ownedAssets = filteredAssets.filter((a) =>
    userAssets.find((userAsset) => a.uuid === userAsset.uuid)
  );

  const calculateNewToAmountDebounced = useCallback(debounce(calculateNewToAmount, 500), [
    account,
    fromAsset,
    toAsset
  ]);

  // SEND AMOUNT CHANGED
  const handleFromAmountChangedEvent = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    handleFromAmountChanged(value);

    calculateNewToAmountDebounced(value);
  };

  const calculateNewFromAmountDebounced = useCallback(debounce(calculateNewFromAmount, 500), [
    account,
    fromAsset,
    toAsset
  ]);

  // RECEIVE AMOUNT CHANGED
  const handleToAmountChangedEvent = async (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    handleToAmountChanged(value);

    calculateNewFromAmountDebounced(value);
  };

  const estimatedGasFee =
    gasPrice &&
    tradeGasLimit &&
    totalTxFeeToString(
      gasPrice,
      bigify(tradeGasLimit).plus(approvalGasLimit ? approvalGasLimit : 0)
    );

  // Accounts with a balance of the chosen asset and base asset
  const filteredAccounts = fromAsset
    ? getAccountsWithAssetBalance(accounts, fromAsset, fromAmount, baseAsset.uuid, estimatedGasFee)
    : [];

  useEffect(() => {
    const defaultAccount = sortByLabel(filteredAccounts)[0];
    if (defaultAccount && ((account && account.uuid !== defaultAccount.uuid) || !account)) {
      handleAccountSelected(defaultAccount);
    }
  }, [JSON.stringify(filteredAccounts)]);

  useEffect(() => {
    if (
      fromAmount &&
      fromAsset &&
      account &&
      !filteredAccounts.find((a) => a.uuid === account.uuid)
    ) {
      handleAccountSelected(undefined);
    }
  }, [fromAsset, fromAmount, gasPrice, tradeGasLimit, approvalGasLimit]);

  useEffect(() => {
    handleRefreshQuote();
  }, [account, toAsset]);

  useEffect(() => {
    handleGasLimitEstimation();
  }, [approvalTx, account]);

  useInterval(
    () => {
      if (!expiration) {
        return;
      }
      const expired = getTimeDifference(expiration) >= 0;
      if (expired !== isExpired) {
        setIsExpired(expired);
      }
    },
    1000,
    false,
    [expiration]
  );

  const checkNetwork = (n: Network) => DEX_NETWORKS.includes(n.id);

  return (
    <>
      <Box mt="20px" mb="1em">
        {isDemoMode && <DemoGatewayBanner />}
        <Box mb="15px">
          <NetworkSelector network={selectedNetwork} filter={checkNetwork} onChange={setNetwork} />
        </Box>
        <Box mb="15px">
          <Box>
            <Body>
              {translateRaw('ACCOUNT_SELECTION_PLACEHOLDER')}{' '}
              <Tooltip tooltip={translateRaw('SWAP_SELECT_ACCOUNT_TOOLTIP')} />
            </Body>
          </Box>
          <AccountSelector
            name="account"
            value={account}
            accounts={filteredAccounts}
            onSelect={handleAccountSelected}
            asset={fromAsset ? userAssets.find((x) => x.uuid === fromAsset.uuid) : undefined}
          />
          {!filteredAccounts.length && fromAsset && (
            <InlineMessage>{translate('ACCOUNT_SELECTION_NO_FUNDS')}</InlineMessage>
          )}
        </Box>
        <Box display="flex">
          <Box mr="1em" flex="1">
            <InputField
              name="swap-from"
              label={translateRaw('SWAP_SEND_AMOUNT')}
              value={fromAmount}
              placeholder="0.00"
              onChange={handleFromAmountChangedEvent}
              height={'54px'}
              isLoading={isCalculatingFromAmount}
              inputError={fromAmountError}
              inputMode="decimal"
            />
          </Box>
          <AssetSelector
            selectedAsset={fromAsset}
            assets={ownedAssets}
            label={translateRaw('X_ASSET')}
            onSelect={handleFromAssetSelected}
            disabled={isCalculatingToAmount || isCalculatingFromAmount}
            searchable={true}
            width="175px"
          />
        </Box>
        <Box variant="rowCenter" my="2">
          <hr style={{ margin: 'auto 0.5rem auto 1px', width: '100%' }} />
          <LinkApp
            variant="barren"
            href="#"
            isExternal={false}
            onClick={handleFlipAssets}
            width="24px"
            height="24px"
          >
            <Icon type="swap-flip" width="24px" height="24px" color="BLUE_BRIGHT" />
          </LinkApp>
          <hr style={{ margin: 'auto 1px auto 0.5rem', width: '100%' }} />
        </Box>
        <Box display="flex">
          <Box mr="1em" flex="1">
            <InputField
              name="swap-to"
              label={translateRaw('SWAP_RECEIVE_AMOUNT')}
              value={toAmount}
              placeholder="0.00"
              onChange={handleToAmountChangedEvent}
              height={'54px'}
              isLoading={isCalculatingToAmount}
              inputError={toAmountError}
              inputMode="decimal"
            />
          </Box>
          <AssetSelector
            selectedAsset={toAsset}
            assets={filteredAssets}
            label={translateRaw('ASSET')}
            onSelect={handleToAssetSelected}
            disabled={isCalculatingToAmount || isCalculatingFromAmount}
            searchable={true}
            width="175px"
          />
        </Box>
        <Box mb={SPACING.SM}>
          {exchangeRate &&
            toAsset &&
            fromAsset &&
            expiration &&
            estimatedGasFee &&
            toAmount &&
            fromAmount && (
              <SwapQuote
                toAsset={toAsset}
                fromAsset={fromAsset}
                fromAssetRate={fromAssetRate}
                toAmount={toAmount}
                fromAmount={fromAmount}
                exchangeRate={exchangeRate}
                baseAsset={baseAsset}
                baseAssetRate={baseAssetRate}
                estimatedGasFee={estimatedGasFee}
                settings={settings}
                isExpired={isExpired}
                expiration={expiration}
                handleRefreshQuote={handleRefreshQuote}
              />
            )}
        </Box>
        <StyledButton
          onClick={onSuccess}
          disabled={
            isDemoMode ||
            !account ||
            isEstimatingGas ||
            isExpired ||
            !estimatedGasFee ||
            isCalculatingToAmount ||
            isCalculatingFromAmount ||
            !fromAmount ||
            !toAmount ||
            !!fromAmountError ||
            !!toAmountError
          }
          loading={isSubmitting}
          data-testid="confirm-swap"
        >
          {fromAsset && toAsset
            ? translate('SWAP_FOR', { $from: fromAsset.ticker, $to: toAsset.ticker })
            : translate('SWAP_ACTION_BUTTON')}
        </StyledButton>
        {txError && (
          <InlineMessage>
            {translate('GAS_LIMIT_ESTIMATION_ERROR_MESSAGE', {
              $error: txError.reason ? txError.reason : txError.message
            })}
          </InlineMessage>
        )}
      </Box>
      <PoweredByText provider="ZEROX" />
    </>
  );
};

export default SwapAssets;
