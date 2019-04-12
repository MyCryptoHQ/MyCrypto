import React from 'react';
import { Heading } from '@mycrypto/ui';
import styled from 'styled-components';

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

const DesktopLayout = styled(props => <Layout {...props} />)`
  display: none;
  background: #e8eaed;
  font-weight: 300;

  @media (min-width: 1080px) {
    display: block;
  }
`;

const DesktopTop = styled.div`
  display: flex;
  align-items: flex-start;
`;

const DesktopTopLeft = styled.div`
  flex: 1;
  min-width: 241px;
`;

const DesktopHeading = styled(Heading)`
  margin-top: 0;
  margin-bottom: 25px;
  font-weight: bold;
`;

const DesktopTopRight = styled.div`
  flex: 2;

  > div {
    margin-bottom: 18px;
  }
`;

const DesktopTopActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 400px;

  @media (min-width: 1370px) {
    display: block;
    margin-right: 21px;
  }
`;

const DesktopModifiedPanel = styled(AccountList)`
  padding: 0;

  .DashboardPanel-headingWrapper {
    padding: 15px;
  }
`;

const MobileLayout = styled(props => <Layout {...props} />)`
  margin-top: 20px;
  background: #e8eaed;
  font-weight: 300;
  @media (min-width: 700px) {
    margin-top: 60px;
  }
  @media (min-width: 1000px) {
    margin-top: 0;
  }
  @media (min-width: 1080px) {
    display: none;
  }
`;

const MobileActions = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0 15px;
`;

export default function Dashboard() {
  return (
    <>
      {/* MOBILE */}
      <AccountContext.Consumer>
        {({ accounts, deleteAccount }) => (
          <MobileLayout fluid={true}>
            <MobileActions>
              {actions.map(action => <ActionTile key={action.title} {...action} />)}
            </MobileActions>
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
          </MobileLayout>
        )}
      </AccountContext.Consumer>
      {/* DESKTOP */}
      <AccountContext.Consumer>
        {({ accounts, deleteAccount }) => (
          <DesktopLayout>
            <DesktopTop>
              <DesktopTopLeft>
                <DesktopHeading as="H2">Your Dashboard</DesktopHeading>
                <DesktopTopActions>
                  {actions.map(action => <ActionTile key={action.title} {...action} />)}
                </DesktopTopActions>
                <div>
                  <TokenList />
                </div>
              </DesktopTopLeft>
              <DesktopTopRight>
                <div>
                  <WalletBreakdown />
                </div>
                <div>
                  <DesktopModifiedPanel accounts={accounts} deleteAccount={deleteAccount} />
                </div>
              </DesktopTopRight>
            </DesktopTop>
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
          </DesktopLayout>
        )}
      </AccountContext.Consumer>
    </>
  );
}
