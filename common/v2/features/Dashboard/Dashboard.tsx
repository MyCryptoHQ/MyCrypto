import React from 'react';
import { Heading } from '@mycrypto/ui';

import { Layout } from 'v2/features';
import {
  AccountList,
  ActionTile,
  TokenList,
  WalletBreakdown,
  RecentTransactionList
} from './components';
import { NotificationsPanel } from './NotificationsPanel';
import { actions } from './constants';
import './Dashboard.scss';
import { AccountContext, AddressBookContext, useDevMode } from 'v2/providers';

export default function Dashboard() {
  const { isDevelopmentMode } = useDevMode();
  return (
    <>
      {/* MOBILE */}
      <Layout className="Dashboard-mobile" fluid={true}>
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
        {isDevelopmentMode && (
          <AccountContext.Consumer>
            {({ accounts }) => (
              <AddressBookContext.Consumer>
                {({ readAddressBook }) => (
                  <div className="Dashboard-mobile-section">
                    <RecentTransactionList
                      accountsList={accounts}
                      readAddressBook={readAddressBook}
                    />
                  </div>
                )}
              </AddressBookContext.Consumer>
            )}
          </AccountContext.Consumer>
        )}
      </Layout>

      {/* DESKTOP */}

      <Layout className="Dashboard-desktop">
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
        {isDevelopmentMode && (
          <AccountContext.Consumer>
            {({ accounts }) => (
              <AddressBookContext.Consumer>
                {({ readAddressBook }) => (
                  <div className="Dashboard-desktop-bottom">
                    <RecentTransactionList
                      readAddressBook={readAddressBook}
                      accountsList={accounts}
                      className="Dashboard-desktop-modifiedPanel"
                    />
                  </div>
                )}
              </AddressBookContext.Consumer>
            )}
          </AccountContext.Consumer>
        )}
      </Layout>
    </>
  );
}
