import React, { useContext } from 'react';
import { Heading } from '@mycrypto/ui';

import { useDevMode } from 'v2/services';
import { AccountContext, AddressBookContext } from 'v2/services/Store';
import { AccountList, BannerAd, Desktop, Mobile } from 'v2/components';
import { ActionTile, TokenList, WalletBreakdown, RecentTransactionList } from './components';
import { NotificationsPanel } from './NotificationsPanel';
import { actions } from './constants';
import './Dashboard.scss';

export default function Dashboard() {
  const { isDevelopmentMode } = useDevMode();
  const { accounts } = useContext(AccountContext);
  const { readAddressBook } = useContext(AddressBookContext);

  return (
    <div>
      {/* Mobile only */}
      <Mobile className="Dashboard-mobile">
        <NotificationsPanel />
        <div className="Dashboard-mobile-actions">
          {actions.map(action => <ActionTile key={action.title} {...action} />)}
        </div>
        <div className="Dashboard-mobile-divider" />
        <div className="Dashboard-mobile-group">
          <div className="Dashboard-mobile-walletBreakdown">
            <WalletBreakdown />
          </div>
          <div className="Dashboard-mobile-section Dashboard-mobile-tokenList">
            <TokenList />
          </div>
        </div>
        <div className="Dashboard-mobile-section">
          <AccountList currentsOnly={true} className="Dashboard-mobile-modifiedPanel" />
        </div>
        <BannerAd />
        {isDevelopmentMode && (
          <div className="Dashboard-mobile-section">
            <RecentTransactionList accountsList={accounts} readAddressBook={readAddressBook} />
          </div>
        )}
      </Mobile>
      {/* Desktop only */}
      <Desktop className="Dashboard-desktop">
        <NotificationsPanel />
        <div className="Dashboard-desktop-top">
          <div className="Dashboard-desktop-top-left">
            <Heading as="h2" className="Dashboard-desktop-top-left-heading">
              Your Dashboard
            </Heading>
            <div className="Dashboard-desktop-top-left-actions">
              {actions.map(action => <ActionTile key={action.title} {...action} />)}
            </div>
            <div>
              <TokenList />
            </div>
          </div>
          <div className="Dashboard-desktop-top-right">
            <div>
              <WalletBreakdown />
            </div>
            <div>
              <AccountList currentsOnly={true} className="Dashboard-desktop-modifiedPanel" />
            </div>
          </div>
        </div>
        <BannerAd />
        {isDevelopmentMode && (
          <div className="Dashboard-desktop-bottom">
            <RecentTransactionList
              readAddressBook={readAddressBook}
              accountsList={accounts}
              className="Dashboard-desktop-modifiedPanel"
            />
          </div>
        )}
      </Desktop>
    </div>
  );
}
