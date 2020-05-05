import React, { useContext, useState, useEffect } from 'react';
import { Panel } from '@mycrypto/ui';
import styled from 'styled-components';

import { translateRaw } from 'v2/translations';
import { AnalyticsService, ANALYTICS_CATEGORIES, RatesContext } from 'v2/services';
import { SettingsContext, StoreContext } from 'v2/services/Store';
import { StoreAsset, TUuid } from 'v2/types';
import { weiToFloat, convertToFiatFromAsset } from 'v2/utils';
import { BREAK_POINTS, SPACING } from 'v2/theme';
import { Fiats } from 'v2/config';
import { Tooltip } from 'v2/components';

import { Balance, BalanceAccount } from './types';
import AccountDropdown from './AccountDropdown';
import BalancesDetailView from './BalancesDetailView';
import WalletBreakdownView from './WalletBreakdownView';
import NoAccountsSelected from './NoAccountsSelected';

const WalletBreakdownTop = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${BREAK_POINTS.SCREEN_MD}) {
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
`;

const AccountDropdownWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 480px;
  margin-bottom: ${SPACING.SM};

  @media (min-width: ${BREAK_POINTS.SCREEN_MD}) {
    margin-bottom: ${SPACING.BASE};
  }
`;

const SAccountDropdown = styled(AccountDropdown)`
  width: 100%;
  margin-left: ${SPACING.XS};
`;

const WalletBreakdownPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  margin-top: ${SPACING.XS};
  padding: 0;

  @media (min-width: ${BREAK_POINTS.SCREEN_MD}) {
    flex-direction: row;
    margin-top: 0;
  }
`;

let wasNumOfAccountsTracked = false;

export function WalletBreakdown() {
  const [showBalanceDetailView, setShowBalanceDetailView] = useState(false);
  const { accounts, totals, currentAccounts } = useContext(StoreContext);
  const { settings, updateSettingsAccounts } = useContext(SettingsContext);
  const { getAssetRate } = useContext(RatesContext);

  // Track number of accounts that user has only once per session
  useEffect(() => {
    if (!wasNumOfAccountsTracked) {
      wasNumOfAccountsTracked = true;
      AnalyticsService.instance.track(ANALYTICS_CATEGORIES.WALLET_BREAKDOWN, `User has accounts`, {
        numOfAccounts: accounts.length
      });
    }
  }, []);

  // Adds/updates an asset in array of balances, which are later displayed in the chart, balance list and in the secondary view
  const balances: Balance[] = totals(currentAccounts)
    .map((asset: StoreAsset) => ({
      id: `${asset.name}-${asset.ticker}`,
      name: asset.name || translateRaw('WALLET_BREAKDOWN_UNKNOWN'),
      ticker: asset.ticker,
      uuid: asset.uuid,
      amount: weiToFloat(asset.balance, asset.decimal),
      fiatValue: convertToFiatFromAsset(asset, getAssetRate(asset)),
      accounts: currentAccounts.reduce((acc, currAccount) => {
        const matchingAccAssets = currAccount.assets.filter(
          (accAsset) => accAsset.uuid === asset.uuid
        );
        if (matchingAccAssets.length) {
          return [
            ...acc,
            ...matchingAccAssets.map((accAsset) => ({
              address: currAccount.address,
              ticker: accAsset.ticker,
              amount: weiToFloat(accAsset.balance, accAsset.decimal),
              fiatValue: convertToFiatFromAsset(accAsset, getAssetRate(accAsset)),
              label: currAccount.label
            }))
          ];
        }
        return acc;
      }, [] as BalanceAccount[])
    }))
    .sort((a, b) => b.fiatValue - a.fiatValue);

  const totalFiatValue = balances.reduce((sum, asset) => {
    return sum + asset.fiatValue;
  }, 0);

  const toggleShowChart = () => {
    setShowBalanceDetailView(!showBalanceDetailView);
  };

  const fiat = Fiats[settings.fiatCurrency];

  return (
    <>
      <WalletBreakdownTop>
        <AccountDropdownWrapper>
          <Tooltip tooltip={translateRaw('DASHBOARD_ACCOUNT_SELECT_TOOLTIP')} />
          <SAccountDropdown
            accounts={accounts}
            selected={settings.dashboardAccounts}
            onSubmit={(selected: TUuid[]) => {
              updateSettingsAccounts(selected);
            }}
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
            accounts={accounts}
            selected={settings.dashboardAccounts}
          />
        ) : (
          <WalletBreakdownView
            balances={balances}
            toggleShowChart={toggleShowChart}
            totalFiatValue={totalFiatValue}
            fiat={fiat}
            accounts={accounts}
            selected={settings.dashboardAccounts}
          />
        )}
      </WalletBreakdownPanel>
    </>
  );
}
