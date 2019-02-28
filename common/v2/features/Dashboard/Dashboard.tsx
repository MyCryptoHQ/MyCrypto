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
import { actions } from './constants';
import './Dashboard.scss';

export default function Dashboard() {
  return (
    <>
      {/* MOBILE */}
      <Layout className="Dashboard-mobile" fluid={true}>
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
          <AccountList />
        </div>
        <div className="Dashboard-mobile-section">
          <RecentTransactionList />
        </div>
      </Layout>
      {/* DESKTOP */}
      <Layout className="Dashboard-desktop">
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
              <AccountList className="Dashboard-desktop-modifiedPanel" />
            </div>
          </div>
        </div>
        <div className="Dashboard-desktop-bottom">
          <RecentTransactionList className="Dashboard-desktop-modifiedPanel" />
        </div>
      </Layout>
    </>
  );
}
