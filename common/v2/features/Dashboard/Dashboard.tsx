import React, { useContext } from 'react';
import { Heading } from '@mycrypto/ui';
import styled from 'styled-components';

import { ROUTE_PATHS } from 'v2/config';
import { useDevMode } from 'v2/services';
import { AccountContext, AddressBookContext } from 'v2/services/Store';
import { translate, translateRaw } from 'translations';
import { AccountList, BannerAd, Desktop, Mobile } from 'v2/components';
import { ActionTile, TokenList, WalletBreakdown, RecentTransactionList } from './components';
import { NotificationsPanel } from './NotificationsPanel';
import { actions } from './constants';
import './Dashboard.scss';

import settingsIcon from 'common/assets/images/icn-settings.svg';

const SettingsHeadingIcon = styled.img`
  margin-right: 12px;
  height: 1em;
`;
const AccountListFooter = styled.div`
  color: #1eb8e7;
`;

export default function Dashboard() {
  const { isDevelopmentMode } = useDevMode();
  const { accounts } = useContext(AccountContext);
  const { readAddressBook } = useContext(AddressBookContext);

  return (
    <div>
      {/* Mobile only */}
      <Mobile className="Dashboard-mobile">
        <NotificationsPanel accounts={accounts} />
        <div className="Dashboard-mobile-actions">
          {actions.map(action => (
            <ActionTile key={action.title} {...action} />
          ))}
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
            currentsOnly={true}
            className="Dashboard-mobile-modifiedPanel"
            footerAction={translateRaw('SETTINGS_HEADING')}
            footerActionLink={ROUTE_PATHS.SETTINGS.path}
          />
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
              <TokenList />
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
                footerAction={
                  <AccountListFooter>
                    <SettingsHeadingIcon src={settingsIcon} alt="Settings" />{' '}
                    {translate('SETTINGS_HEADING')}
                  </AccountListFooter>
                }
                footerActionLink={ROUTE_PATHS.SETTINGS.path}
              />
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
