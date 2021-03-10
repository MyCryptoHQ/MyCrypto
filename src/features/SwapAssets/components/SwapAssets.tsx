import React, { useCallback, useContext, useEffect, useState } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';

import {
  AccountSelector,
  AssetSelector,
  Body,
  Box,
  Button,
  DemoGatewayBanner,
  InlineMessage,
  InputField,
  PoweredByText,
  Tooltip
} from '@components';
import { useRates } from '@services/Rates';
import { StoreContext } from '@services/Store';
import {
  AppState,
  getBaseAssetByNetwork,
  getIsDemoMode,
  getSettings,
  selectDefaultNetwork
} from '@store';
import { SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { Asset, ExtendedAsset, ISwapAsset, Network, StoreAccount } from '@types';
import { bigify, getTimeDifference, totalTxFeeToString, useInterval } from '@utils';
import { useDebounce } from '@vendor';

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

type ISwapProps = SwapFormState & {
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
};

const SwapAssets = (props: Props) => {
  const {
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
    approvalTx,
    exchangeRate,
    approvalGasLimit,
    tradeGasLimit,
    gasPrice,
    isEstimatingGas,
    expiration,
    isDemoMode,
    baseAsset,
    settings
  } = props;

  const [isExpired, setIsExpired] = useState(false);
  const { accounts, userAssets } = useContext(StoreContext);
  const { getAssetRate } = useRates();

  const baseAssetRate = getAssetRate(baseAsset);
  const fromAssetRate = fromAsset && getAssetRate(fromAsset as Asset);

  // show only unused assets and assets owned by the user
  const filteredAssets = getUnselectedAssets(assets, fromAsset, toAsset);
  const ownedAssets = filteredAssets.filter((a) =>
    userAssets.find((userAsset) => a.uuid === userAsset.uuid)
  );

  const [, , calculateNewToAmountDebounced] = useDebounce(
    useCallback(() => {
      calculateNewToAmount(fromAmount);
    }, [fromAmount, account]),
    500
  );

  // SEND AMOUNT CHANGED
  const handleFromAmountChangedEvent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    handleFromAmountChanged(value);

    calculateNewToAmountDebounced();
  };

  const [, , calculateNewFromAmountDebounced] = useDebounce(
    useCallback(() => {
      calculateNewFromAmount(toAmount);
    }, [toAmount, account]),
    500
  );

  // RECEIVE AMOUNT CHANGED
  const handleToAmountChangedEvent = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    handleToAmountChanged(value);

    calculateNewFromAmountDebounced();
  };

  // Calculate new "to amount" after "to asset" is selected
  useEffect(() => {
    if (!fromAmount) {
      return;
    }

    calculateNewToAmount(fromAmount);
  }, [toAsset]);

  useEffect(() => {
    if (
      fromAmount &&
      fromAsset &&
      account &&
      !getAccountsWithAssetBalance(accounts, fromAsset, fromAmount).find(
        (a) => a.uuid === account.uuid
      )
    ) {
      handleAccountSelected(undefined);
    }
  }, [fromAsset, fromAmount]);

  useEffect(() => {
    handleRefreshQuote();
  }, [account]);

  useEffect(() => {
    handleGasLimitEstimation();
  }, [approvalTx, account]);

  const estimatedGasFee =
    gasPrice &&
    tradeGasLimit &&
    totalTxFeeToString(
      gasPrice,
      bigify(tradeGasLimit).plus(approvalGasLimit ? approvalGasLimit : 0)
    );

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

  // Accounts with a balance of the chosen asset
  const filteredAccounts = fromAsset
    ? getAccountsWithAssetBalance(accounts, fromAsset, fromAmount, baseAsset.uuid, estimatedGasFee)
    : [];

  return (
    <>
      <Box mt="20px" mb="1em">
        {isDemoMode && <DemoGatewayBanner />}
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
          />
        </Box>
        <Box display="flex">
          <Box mr="1em" flex="1">
            <InputField
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

const mapStateToProps = (state: AppState) => {
  const network = selectDefaultNetwork(state) as Network;

  return {
    isDemoMode: getIsDemoMode(state),
    baseAsset: getBaseAssetByNetwork(network)(state) as ExtendedAsset,
    settings: getSettings(state)
  };
};

const connector = connect(mapStateToProps);
type Props = ConnectedProps<typeof connector> & ISwapProps;

export default connector(SwapAssets);
