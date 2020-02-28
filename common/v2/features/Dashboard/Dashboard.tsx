import React, { useContext } from 'react';
import { Heading } from '@mycrypto/ui';
import styled from 'styled-components';

import { AccountList, BannerAd, Desktop, Mobile } from 'v2/components';
import { IS_ACTIVE_FEATURE } from 'v2/config';
import { AccountContext, StoreContext } from 'v2/services/Store';

import { NotificationsPanel } from '../NotificationsPanel';
import { DashboardZapCTA } from '../DeFiZap';
import { ActionTile, TokenPanel, WalletBreakdown, RecentTransactionList } from './components';
import { actions } from './constants';
import './Dashboard.scss';

// Keep the same mobile width as an ActionTile
const EmptyTile = styled.div`
  width: 30%;
`;

export default function Dashboard() {
  const { isUnlockVIP, currentAccounts } = useContext(StoreContext);
  const { accounts } = useContext(AccountContext);
  return (
    <div>
      {/* Mobile only */}
      <Mobile className="Dashboard-mobile">
        <NotificationsPanel accounts={accounts} />
        <div className="Dashboard-mobile-actions">
          {actions.map(action => (
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
        {!isUnlockVIP && <BannerAd />}
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
              Your Dashboard
            </Heading>
            <div className="Dashboard-desktop-top-left-actions">
              {actions.map(action => (
                <ActionTile key={action.title} {...action} />
              ))}
            </div>
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
        {!isUnlockVIP && <BannerAd />}
        <div className="Dashboard-desktop-bottom">
          <RecentTransactionList
            accountsList={currentAccounts}
            className="Dashboard-desktop-modifiedPanel"
          />
        </div>
      </Desktop>
    </div>
  );
}
