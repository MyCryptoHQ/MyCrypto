import React, { useContext, useState } from 'react';
import { Panel } from '@mycrypto/ui';
import styled from 'styled-components';

import { translateRaw } from 'translations';
import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import {
  AccountContext,
  SettingsContext,
  getCurrentsFromContext,
  getBalanceFromAccount,
  getBaseAssetFromAccount,
  getTokenBalanceFromAccount,
  getAssetByUUID
} from 'v2/services/Store';
import { ExtendedAccount, Asset } from 'v2/types';
import { BREAK_POINTS } from 'v2/theme';

import { Balance, Fiat } from './types';
import AccountDropdown from './AccountDropdown';
import BalancesDetailView from './BalancesDetailView';
import WalletBreakdownView from './WalletBreakdownView';
import NoAccountsSelected from './NoAccountsSelected';

const { SCREEN_MD } = BREAK_POINTS;

const WalletBreakdownTop = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${SCREEN_MD}) {
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
`;

const AccountDropdownWrapper = styled.div`
  width: 100%;
  max-width: 480px;
  margin-bottom: 30px;
`;

const WalletBreakdownPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  padding: 0;

  @media (min-width: ${SCREEN_MD}) {
    flex-direction: row;
    margin-top: 0;
  }
`;

const numberOfAssetsDisplayed = 4;
let wasNumOfAccountsTracked = false;

export function WalletBreakdown() {
  const [showBalanceDetailView, setShowBalanceDetailView] = useState(false);
  const { accounts } = useContext(AccountContext);
  const { settings, updateSettingsAccounts } = useContext(SettingsContext);

  // Track number of accounts that user has only once per session
  if (!wasNumOfAccountsTracked) {
    wasNumOfAccountsTracked = true;
    AnalyticsService.instance.track(ANALYTICS_CATEGORIES.WALLET_BREAKDOWN, `User has accounts`, {
      numOfAccounts: accounts.length
    });
  }

  const balances: Balance[] = [];
  const currentAccounts: ExtendedAccount[] = getCurrentsFromContext(
    accounts,
    settings.dashboardAccounts
  );

  // Adds/updates an asset in array of balances, which are later displayed in the chart, balance list and in the secondary view
  const addAssetToBalances = (
    asset: Asset | undefined,
    assetAmount: number,
    assetValue: number
  ) => {
    const assetName = asset ? asset.name : translateRaw('WALLET_BREAKDOWN_UNKNOWN');
    const assetTicker = asset ? asset.ticker : '';

    const existingAssetInBalances = balances.find(balance => balance.name === assetName);

    if (!existingAssetInBalances) {
      balances.push({
        name: assetName,
        amount: assetAmount,
        fiatValue: assetAmount * assetValue,
        ticker: assetTicker
      });
    } else {
      existingAssetInBalances.amount = existingAssetInBalances.amount + assetAmount;
      existingAssetInBalances.fiatValue = existingAssetInBalances.amount * assetValue;
    }
  };

  // Combine all base assets and account assets in the balances array
  currentAccounts.forEach((account: ExtendedAccount) => {
    const baseAsset = getBaseAssetFromAccount(account);
    const baseAssetAmount = parseFloat(getBalanceFromAccount(account));
    const baseAssetValue = 333.33; //TODO: Get actual asset value from the local cache

    addAssetToBalances(baseAsset, baseAssetAmount, baseAssetValue);

    account.assets.forEach(accountAsset => {
      const asset = getAssetByUUID(accountAsset.uuid);
      const assetAmount = parseFloat(getTokenBalanceFromAccount(account, asset));
      const assetValue = 333.33; //TODO: Get actual asset value from the local cache
      addAssetToBalances(asset, assetAmount, assetValue);
    });
  });

  balances.sort((a, b) => {
    return b.fiatValue - a.fiatValue;
  });

  //TODO: Get fiat symbol and text
  const fiat: Fiat = {
    name: 'US Dollars',
    symbol: '$'
  };
  const totalFiatValue = balances.reduce((sum, asset) => {
    return (sum += asset.fiatValue);
  }, 0);

  /* Construct a finalBalances array which consits of top X assets and a otherTokensAsset
     which combines the fiat value of all remaining tokens that are in the balances array*/
  let finalBalances = balances;
  if (balances.length > numberOfAssetsDisplayed) {
    const otherBalances = balances.slice(numberOfAssetsDisplayed, balances.length);

    const otherTokensAsset = {
      name: translateRaw('WALLET_BREAKDOWN_OTHER'),
      ticker: translateRaw('WALLET_BREAKDOWN_OTHER_TICKER'),
      isOther: true,
      amount: 0,
      fiatValue: otherBalances.reduce((sum, asset) => {
        return (sum += asset.fiatValue);
      }, 0)
    };

    finalBalances = balances.slice(0, numberOfAssetsDisplayed);
    finalBalances.push(otherTokensAsset);
  }

  const toggleShowChart = () => {
    setShowBalanceDetailView(!showBalanceDetailView);
  };

  return (
    <>
      <WalletBreakdownTop>
        <AccountDropdownWrapper>
          <AccountDropdown
            accounts={accounts}
            selected={settings.dashboardAccounts}
            onSubmit={(selected: string[]) => updateSettingsAccounts(selected)}
          />
        </AccountDropdownWrapper>
      </WalletBreakdownTop>
      <WalletBreakdownPanel>
        {currentAccounts.length === 0 ? (
          <NoAccountsSelected />
        ) : showBalanceDetailView ? (
          <BalancesDetailView
            balances={balances}
            toggleShowChart={toggleShowChart}
            totalFiatValue={totalFiatValue}
            fiat={fiat}
          />
        ) : (
          <WalletBreakdownView
            balances={finalBalances}
            toggleShowChart={toggleShowChart}
            totalFiatValue={totalFiatValue}
            fiat={fiat}
          />
        )}
      </WalletBreakdownPanel>
    </>
  );
}
