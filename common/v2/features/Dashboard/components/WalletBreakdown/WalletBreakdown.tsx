import React, { useContext, useState } from 'react';
import { Panel } from '@mycrypto/ui';
import styled from 'styled-components';

import { translateRaw } from 'v2/translations';
import { AnalyticsService, ANALYTICS_CATEGORIES, RatesContext } from 'v2/services';
import { SettingsContext, StoreContext, AccountContext } from 'v2/services/Store';
import { StoreAsset } from 'v2/types';
import { weiToFloat, convertToFiatFromAsset } from 'v2/utils';
import { BREAK_POINTS } from 'v2/theme';
import { Fiats } from 'v2/config';

import { Balance } from './types';
import AccountDropdown from './AccountDropdown';
import BalancesDetailView from './BalancesDetailView';
import WalletBreakdownView from './WalletBreakdownView';
import NoAccountsSelected from './NoAccountsSelected';
import {} from 'v2/utils/convert';

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

let wasNumOfAccountsTracked = false;

export function WalletBreakdown() {
  const [showBalanceDetailView, setShowBalanceDetailView] = useState(false);
  const { totals, currentAccounts } = useContext(StoreContext);
  const { accounts } = useContext(AccountContext);
  const { settings, updateSettingsAccounts } = useContext(SettingsContext);
  const { getAssetRate } = useContext(RatesContext);

  // Track number of accounts that user has only once per session
  if (!wasNumOfAccountsTracked) {
    wasNumOfAccountsTracked = true;
    AnalyticsService.instance.track(ANALYTICS_CATEGORIES.WALLET_BREAKDOWN, `User has accounts`, {
      numOfAccounts: accounts.length
    });
  }

  const selectedAccounts = currentAccounts();

  // Adds/updates an asset in array of balances, which are later displayed in the chart, balance list and in the secondary view
  const balances: Balance[] = totals(selectedAccounts)
    .map((asset: StoreAsset) => ({
      name: asset.name || translateRaw('WALLET_BREAKDOWN_UNKNOWN'),
      ticker: asset.ticker,
      amount: weiToFloat(asset.balance, asset.decimal),
      fiatValue: convertToFiatFromAsset(asset, getAssetRate(asset))
    }))
    .sort((a, b) => b.fiatValue - a.fiatValue);

  const totalFiatValue = balances.reduce((sum, asset) => {
    return (sum += asset.fiatValue);
  }, 0);

  const toggleShowChart = () => {
    setShowBalanceDetailView(!showBalanceDetailView);
  };

  const fiat = Fiats[settings.fiatCurrency];

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
        {selectedAccounts.length === 0 ? (
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
