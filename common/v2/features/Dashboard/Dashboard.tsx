import React from 'react';
import { Heading } from '@mycrypto/ui';

import { Layout } from 'v2/features';
import {
  AccountList,
  ActionTile,
  RecentTransactionList,
  TokenList,
  WalletBreakdown
} from './components';
import { NotificationsPanel } from './NotificationsPanel';
import { actions } from './constants';
import './Dashboard.scss';
import { AccountContext, AddressMetadataContext } from 'v2/providers';

export default function Dashboard() {
  return (
    <>
      {/* MOBILE */}
      <AccountContext.Consumer>
        {({ accounts, deleteAccount }) => (
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
              <AccountList
                accounts={accounts}
                deleteAccount={deleteAccount}
                className="Dashboard-mobile-modifiedPanel"
              />
            </div>
            <AddressMetadataContext.Consumer>
              {({ readAddressMetadata }) => (
                <div className="Dashboard-mobile-section">
                  <RecentTransactionList
                    accountsList={accounts}
                    readAddressMetadata={readAddressMetadata}
                  />
                </div>
              )}
            </AddressMetadataContext.Consumer>
          </Layout>
        )}
      </AccountContext.Consumer>
      {/* DESKTOP */}
      <AccountContext.Consumer>
        {({ accounts, deleteAccount }) => (
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
                  <AccountList
                    accounts={accounts}
                    deleteAccount={deleteAccount}
                    className="Dashboard-desktop-modifiedPanel"
                  />
                </div>
              </div>
            </div>
            <AddressMetadataContext.Consumer>
              {({ readAddressMetadata }) => (
                <div className="Dashboard-desktop-bottom">
                  <RecentTransactionList
                    readAddressMetadata={readAddressMetadata}
                    accountsList={accounts}
                    className="Dashboard-desktop-modifiedPanel"
                  />
                </div>
              )}
            </AddressMetadataContext.Consumer>
          </Layout>
        )}
      </AccountContext.Consumer>
    </>
  );
}
