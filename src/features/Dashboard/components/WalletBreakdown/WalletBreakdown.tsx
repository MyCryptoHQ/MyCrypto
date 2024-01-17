import { useState } from 'react';

import { Panel } from '@mycrypto/ui';
import styled from 'styled-components';

import { Tooltip } from '@components';
import { getFiat } from '@config/fiats';
import { buildBalances, buildTotalFiatValue } from '@helpers';
import { useRates } from '@services';
import { useSettings } from '@services/Store';
import { isNotExcludedAsset } from '@services/Store/helpers';
import { getStoreAccounts, selectCurrentAccounts, useSelector } from '@store';
import { BREAK_POINTS, SPACING } from '@theme';
import { translateRaw } from '@translations';
import { Balance, TUuid } from '@types';

import AccountDropdown from './AccountDropdown';
import BalancesDetailView from './BalancesDetailView';
import NoAccountsSelected from './NoAccountsSelected';
import WalletBreakdownView from './WalletBreakdownView';

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
  margin-bottom: ${SPACING.BASE};
  padding: 0;
  @media (min-width: ${BREAK_POINTS.SCREEN_MD}) {
    flex-direction: row;
    margin-top: 0;
  }
`;

export function WalletBreakdown() {
  const [showBalanceDetailView, setShowBalanceDetailView] = useState(false);
  const accounts = useSelector(getStoreAccounts);
  const { settings, updateSettingsAccounts } = useSettings();
  const { getAssetRate, getAssetChange } = useRates();
  const currentAccounts = useSelector(selectCurrentAccounts);

  // Adds/updates an asset in array of balances, which are later displayed in the chart, balance list and in the secondary view
  const balances: Balance[] = buildBalances(
    currentAccounts,
    settings,
    getAssetRate,
    getAssetChange,
    isNotExcludedAsset
  );

  const totalFiatValue = buildTotalFiatValue(balances);

  const toggleShowChart = () => {
    setShowBalanceDetailView(!showBalanceDetailView);
  };

  const fiat = getFiat(settings);

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
