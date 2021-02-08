import React, { useContext, useEffect } from 'react';

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
  Tooltip
} from '@components';
import { DEFAULT_NETWORK } from '@config';
import { useRates } from '@services/Rates';
import {
  getBaseAssetByNetwork,
  StoreContext,
  useAssets,
  useNetworks,
  useSettings
} from '@services/Store';
import { AppState, getIsDemoMode } from '@store';
import { SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { Asset, ISwapAsset, StoreAccount } from '@types';
import { totalTxFeeToString } from '@utils';

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
};

let calculateToAmountTimeout: ReturnType<typeof setTimeout> | null = null;
let calculateFromAmountTimeout: ReturnType<typeof setTimeout> | null = null;

export const SwapAssets = (props: Props) => {
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
    exchangeRate,
    gasLimit,
    gasPrice,
    expiration,
    isDemoMode
  } = props;

  const { accounts, userAssets } = useContext(StoreContext);
  const { getNetworkById } = useNetworks();
  const { assets: allAssets } = useAssets();
  const { getAssetRate } = useRates();
  const { settings } = useSettings();

  const network = getNetworkById(DEFAULT_NETWORK);
  const baseAsset = getBaseAssetByNetwork({ network, assets: allAssets })!;
  const baseAssetRate = getAssetRate(baseAsset);
  const fromAssetRate = fromAsset && getAssetRate(fromAsset as Asset);

  // Accounts with a balance of the chosen asset
  const filteredAccounts = fromAsset
    ? getAccountsWithAssetBalance(accounts, fromAsset, fromAmount)
    : [];

  // show only unused assets and assets owned by the user
  const filteredAssets = getUnselectedAssets(assets, fromAsset, toAsset);
  const ownedAssets = filteredAssets.filter((a) =>
    userAssets.find((userAsset) => a.uuid === userAsset.uuid)
  );

  // SEND AMOUNT CHANGED
  const handleFromAmountChangedEvent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    handleFromAmountChanged(value);

    // Calculate new "to amount" 500 ms after user stopped typing
    if (calculateToAmountTimeout) clearTimeout(calculateToAmountTimeout);
    calculateToAmountTimeout = setTimeout(() => {
      calculateNewToAmount(value);
    }, 500);
  };

  // RECEIVE AMOUNT CHANGED
  const handleToAmountChangedEvent = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    handleToAmountChanged(value);

    // Calculate new "from amount" 500 ms after user stopped typing
    if (calculateFromAmountTimeout) clearTimeout(calculateFromAmountTimeout);
    calculateFromAmountTimeout = setTimeout(() => {
      calculateNewFromAmount(value);
    }, 500);
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

  const estimatedGasFee = gasPrice && gasLimit && totalTxFeeToString(gasPrice, gasLimit);

  return (
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
          onSelect={(option: StoreAccount) => {
            handleAccountSelected(option);
          }}
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
        {exchangeRate && toAsset && fromAsset && expiration && estimatedGasFee && (
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
            expiration={expiration}
          />
        )}
      </Box>
      <StyledButton
        onClick={onSuccess}
        disabled={
          isDemoMode ||
          !account ||
          isCalculatingToAmount ||
          isCalculatingFromAmount ||
          !fromAmount ||
          !toAmount ||
          !!fromAmountError ||
          !!toAmountError
        }
        loading={isSubmitting}
      >
        {translate('ACTION_6')}
      </StyledButton>
      {txError && (
        <InlineMessage>
          {translate('GAS_LIMIT_ESTIMATION_ERROR_MESSAGE', {
            $error: txError.reason ? txError.reason : txError.message
          })}
        </InlineMessage>
      )}
    </Box>
  );
};

const mapStateToProps = (state: AppState) => ({
  isDemoMode: getIsDemoMode(state)
});

const connector = connect(mapStateToProps);
type Props = ConnectedProps<typeof connector> & ISwapProps;

export default connector(SwapAssets);
