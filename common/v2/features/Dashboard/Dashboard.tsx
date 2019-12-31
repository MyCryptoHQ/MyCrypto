import React, { useContext } from 'react';
import { Heading } from '@mycrypto/ui';
import styled from 'styled-components';

import { AccountContext, StoreContext } from 'v2/services/Store';
import { AccountList, BannerAd, Desktop, Mobile } from 'v2/components';
import { ActionTile, TokenPanel, WalletBreakdown, RecentTransactionList } from './components';
import { NotificationsPanel } from '../NotificationsPanel';
import { actions } from './constants';
import './Dashboard.scss';

// Keep the same mobile width as an ActionTile
const EmptyTile = styled.div`
  width: 110px;
`;

export default function Dashboard() {
  const { isUnlockVIP, currentAccounts } = useContext(StoreContext);
  const { accounts } = useContext(AccountContext);
  const storeAccounts = currentAccounts();
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
            currentsOnly={true}
            className="Dashboard-mobile-modifiedPanel"
            copyable={true}
            dashboard={true}
          />
        </div>
        {!isUnlockVIP && <BannerAd />}
        <div className="Dashboard-mobile-section">
          <RecentTransactionList accountsList={storeAccounts} />
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
            <div>
              <TokenPanel />
            </div>
          </div>
          <div className="Dashboard-desktop-top-right">
            <div>
              <WalletBreakdown />
            </div>
            <div>
              <AccountList
                currentsOnly={true}
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
            accountsList={storeAccounts}
            className="Dashboard-desktop-modifiedPanel"
          />
        </div>
      </Desktop>
    </div>
  );
}
