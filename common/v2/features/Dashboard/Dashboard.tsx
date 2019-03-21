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
import {
  TransactionHistoryContext,
  TransactionContext,
  AddressMetadataContext,
  AccountProvider
} from 'v2/providers';

export default function Dashboard() {
  return (
    <>
      {/* MOBILE */}
      <AccountProvider.Context.Consumer>
        {({ resource, destroy }) => (
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
              <AccountList
                accounts={resource}
                deleteAccount={destroy}
                className="Dashboard-mobile-modifiedPanel"
              />
            </div>
            <AddressMetadataContext.Consumer>
              {({ readAddressMetadata }) => (
                <TransactionContext.Consumer>
                  {({ transactions }) => (
                    <TransactionHistoryContext.Consumer>
                      {({ transactionHistories }) => (
                        <div className="Dashboard-mobile-section">
                          <RecentTransactionList
                            transactions={transactions}
                            readAddressMetadata={readAddressMetadata}
                            transactionHistories={transactionHistories}
                          />
                        </div>
                      )}
                    </TransactionHistoryContext.Consumer>
                  )}
                </TransactionContext.Consumer>
              )}
            </AddressMetadataContext.Consumer>
          </Layout>
        )}
      </AccountProvider.Context.Consumer>
      {/* DESKTOP */}
      <AccountProvider.Context.Consumer>
        {({ resource, destroy }) => (
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
                  <AccountList
                    accounts={resource}
                    deleteAccount={destroy}
                    className="Dashboard-desktop-modifiedPanel"
                  />
                </div>
              </div>
            </div>
            <AddressMetadataContext.Consumer>
              {({ readAddressMetadata }) => (
                <TransactionContext.Consumer>
                  {({ transactions }) => {
                    return (
                      <TransactionHistoryContext.Consumer>
                        {({ transactionHistories }) => {
                          return (
                            <div className="Dashboard-desktop-bottom">
                              <RecentTransactionList
                                transactionHistories={transactionHistories}
                                readAddressMetadata={readAddressMetadata}
                                transactions={transactions}
                                className="Dashboard-desktop-modifiedPanel"
                              />
                            </div>
                          );
                        }}
                      </TransactionHistoryContext.Consumer>
                    );
                  }}
                </TransactionContext.Consumer>
              )}
            </AddressMetadataContext.Consumer>
          </Layout>
        )}
      </AccountProvider.Context.Consumer>
    </>
  );
}
