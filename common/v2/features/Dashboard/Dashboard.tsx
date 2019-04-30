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
  AccountContext,
  TransactionHistoryContext,
  TransactionContext,
  AddressMetadataContext
} from 'v2/providers';

interface AccountListProps {
  syncAccounts: Function;
}

class AccountListContainer extends React.Component<AccountListProps, {}> {
  componentDidMount() {
    this.props.syncAccounts();
  }

  render() {
    const { children } = this.props;
    return <>{children}</>;
  }
}

export default function Dashboard() {
  return (
    <>
      {/* MOBILE */}
      <AccountContext.Consumer>
        {({ accounts, deleteAccount, syncAccounts }) => (
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
              <AccountListContainer syncAccounts={syncAccounts}>
                <AccountList
                  accounts={accounts}
                  deleteAccount={deleteAccount}
                  className="Dashboard-mobile-modifiedPanel"
                />
              </AccountListContainer>
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
      </AccountContext.Consumer>
      {/* DESKTOP */}
      <AccountContext.Consumer>
        {({ accounts, deleteAccount, syncAccounts }) => (
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
                  <AccountListContainer syncAccounts={syncAccounts}>
                    <AccountList
                      accounts={accounts}
                      deleteAccount={deleteAccount}
                      className="Dashboard-desktop-modifiedPanel"
                    />
                  </AccountListContainer>
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
      </AccountContext.Consumer>
    </>
  );
}
