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
import { MYC_DEXAG_MARKUP_THRESHOLD } from '@config';
import { StoreContext } from '@services/Store';
import { AppState, getIsDemoMode } from '@store';
import { COLORS, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { ISwapAsset, StoreAccount } from '@types';
import { bigify, trimBN } from '@utils';

import { getAccountsWithAssetBalance, getUnselectedAssets } from '../helpers';

const StyledButton = styled(Button)`
  margin-top: 12px;
  width: 100%;
  && div {
    justify-content: center;
  }
`;

interface ISwapProps {
  account: StoreAccount;
  fromAmount: string;
  toAmount: string;
  fromAsset: ISwapAsset;
  toAsset: ISwapAsset;
  assets: ISwapAsset[];
  isCalculatingFromAmount: boolean;
  isCalculatingToAmount: boolean;
  fromAmountError: string;
  toAmountError: string;
  txError: CustomError | undefined;
  initialToAmount: string;
  exchangeRate: string;
  markup: string;
  isSubmitting: boolean;
  raw: any;
  onSuccess(): void;
  handleFromAssetSelected(asset: ISwapAsset): void;
  handleToAssetSelected(asset: ISwapAsset): void;
  calculateNewFromAmount(value: string): Promise<void>;
  calculateNewToAmount(value: string): Promise<void>;
  handleFromAmountChanged(value: string): void;
  handleToAmountChanged(value: string): void;
  handleAccountSelected(account?: StoreAccount): void;
}

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
    markup,
    raw,
    isDemoMode
  } = props;

  const { accounts, userAssets } = useContext(StoreContext);

  // Accounts with a balance of the chosen asset
  const filteredAccounts = fromAsset
    ? getAccountsWithAssetBalance(accounts, fromAsset, fromAmount)
    : [];

  // show only unused assets and assets owned by the user
  const filteredAssets = getUnselectedAssets(assets, fromAsset, toAsset);
  const ownedAssets = filteredAssets.filter((a) =>
    userAssets.find((userAsset) => a.ticker === userAsset.ticker)
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

  const makeDisplayString = (amount: string) =>
    bigify(trimBN(amount, 10)).lte(bigify(0.01))
      ? '<0.01'
      : `~ ${bigify(trimBN(amount, 10)).toFixed(2)}`;

  return (
    <Box mt="20px" mb="1em">
      {isDemoMode && <DemoGatewayBanner />}
      <Box display="flex">
        <Box mr="1em" flex="1">
          <InputField
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
        {exchangeRate && toAsset && fromAsset && (
          <Box display="flex" justifyContent="space-between">
            <Body>
              {translateRaw('SWAP_RATE_LABEL')}{' '}
              <Tooltip tooltip={translateRaw('SWAP_RATE_TOOLTIP')} />
            </Body>
            <Body>
              {translateRaw('SWAP_RATE_TEXT', {
                $displayString: makeDisplayString(exchangeRate.toString()),
                $toAssetSymbol: toAsset.ticker,
                $fromAssetSymbol: fromAsset.ticker
              })}
            </Body>
          </Box>
        )}
        {markup && fromAsset && (
          <Box display="flex" justifyContent="space-between">
            <Body>
              {translateRaw('SWAP_MARKUP_LABEL')}{' '}
              <Tooltip tooltip={translateRaw('SWAP_MARKUP_TOOLTIP')} />
            </Body>
            <Body
              color={bigify(markup).gte(MYC_DEXAG_MARKUP_THRESHOLD) ? COLORS.RED : COLORS.GREEN}
            >
              {`${makeDisplayString(markup.toString())}%`}
            </Body>
          </Box>
        )}
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
          asset={fromAsset ? userAssets.find((x) => x.ticker === fromAsset.ticker) : undefined}
        />
        {!filteredAccounts.length && fromAsset && (
          <InlineMessage>{translate('ACCOUNT_SELECTION_NO_FUNDS')}</InlineMessage>
        )}
        {raw && (
          <>
            {`Price: ${raw.price}`}
            <br />
            {`Provider: ${raw.sources
              .filter((s: any) => s.proportion !== '0')
              .map((s: any) => s.name)
              .join(',')}`}
            <br />
            {JSON.stringify(raw)}
          </>
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
