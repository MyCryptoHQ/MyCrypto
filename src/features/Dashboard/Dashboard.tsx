import React, { useContext } from 'react';
import { Heading } from '@mycrypto/ui';
import styled from 'styled-components';

import { AccountList, Desktop, Mobile } from '@components';
import BannerAd from '@components/BannerAd/BannerAd';
import { AccountContext, StoreContext } from '@services/Store';
import { translateRaw } from '@translations';
import { useFeatureFlags } from '@services';

import { NotificationsPanel } from '../NotificationsPanel';
import { DashboardZapCTA } from '../DeFiZap';
import {
  ActionTile,
  TokenPanel,
  WalletBreakdown,
  RecentTransactionList,
  MembershipPanel
} from './components';
import { actions } from './constants';
import './Dashboard.scss';

// Keep the same mobile width as an ActionTile
const EmptyTile = styled.div`
  width: 30%;
`;

const DashboardWrapper = styled.div`
  width: 100%;
`;

export default function Dashboard() {
  const { IS_ACTIVE_FEATURE } = useFeatureFlags();
  const { isMyCryptoMember, currentAccounts } = useContext(StoreContext);
  const { accounts } = useContext(AccountContext);
  return (
    <DashboardWrapper>
      {/* Mobile only */}
      <Mobile className="Dashboard-mobile">
        <NotificationsPanel accounts={accounts} />
        <div className="Dashboard-mobile-actions">
          {actions.map((action) => (
            <ActionTile key={action.title} {...action} />
          ))}
          {/*In mobile we only have 5 tiles on 2 rows. To allow 'space-between' to handle the gaps, we
          add a sixth tile with the same width.*/}
          <EmptyTile />
        </div>
        <div className="Dashboard-mobile-divider" />
        <div className="Dashboard-mobile-group">
          <div className="Dashboard-mobile-walletBreakdown">
            <WalletBreakdown />
          </div>
          {IS_ACTIVE_FEATURE.MYC_MEMBERSHIP && (
            <div className="Dashboard-mobile-section Dashboard-mobile-tokenList">
              <MembershipPanel />
            </div>
          )}
          <div className="Dashboard-mobile-section Dashboard-mobile-tokenList">
            <TokenPanel />
          </div>
        </div>
        <div className="Dashboard-mobile-section">
          <AccountList
            accounts={currentAccounts}
            className="Dashboard-mobile-modifiedPanel"
            copyable={true}
            dashboard={true}
          />
        </div>
        {IS_ACTIVE_FEATURE.DEFIZAP && (
          <div className="Dashboard-mobile-section">
            <DashboardZapCTA className="Dashboard-mobile-modifiedPanel" />
          </div>
        )}
        {!isMyCryptoMember && <BannerAd />}
        <div className="Dashboard-mobile-section">
          <RecentTransactionList accountsList={currentAccounts} />
        </div>
      </Mobile>
      {/* Desktop only */}
      <Desktop className="Dashboard-desktop">
        <NotificationsPanel accounts={accounts} />
        <div className="Dashboard-desktop-top">
          <div className="Dashboard-desktop-top-left">
            <Heading as="h2" className="Dashboard-desktop-top-left-heading">
              {translateRaw('YOUR_DASHBOARD')}
            </Heading>
            <div className="Dashboard-desktop-top-left-actions">
              {actions.map((action) => (
                <ActionTile key={action.title} {...action} />
              ))}
            </div>
            {IS_ACTIVE_FEATURE.MYC_MEMBERSHIP && (
              <div className="Dashboard-desktop-top-left-token">
                <MembershipPanel />
              </div>
            )}
            <div className="Dashboard-desktop-top-left-tokens">
              <TokenPanel />
            </div>
          </div>
          <div className="Dashboard-desktop-top-right">
            <div>
              <WalletBreakdown />
            </div>
            {IS_ACTIVE_FEATURE.DEFIZAP && (
              <div>
                <DashboardZapCTA className="Dashboard-desktop-modifiedPanel" />
              </div>
            )}
            <div>
              <AccountList
                accounts={currentAccounts}
                className="Dashboard-desktop-modifiedPanel"
                copyable={true}
                dashboard={true}
              />
            </div>
          </div>
        </div>
        {!isMyCryptoMember && <BannerAd />}
        <div className="Dashboard-desktop-bottom">
          <RecentTransactionList
            accountsList={currentAccounts}
            className="Dashboard-desktop-modifiedPanel"
          />
        </div>
      </Desktop>
    </DashboardWrapper>
  );
}
