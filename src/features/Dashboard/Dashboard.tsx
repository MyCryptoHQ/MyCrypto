import { Heading } from '@mycrypto/ui';
import styled from 'styled-components';

import { AccountList, ActionPanel, Desktop, Mobile } from '@components';
import BannerAd from '@components/BannerAd/BannerAd';
import { useFeatureFlags } from '@services';
import { useAccounts } from '@services/Store';
import { getIsMyCryptoMember, selectCurrentAccounts, useSelector } from '@store';
import { translateRaw } from '@translations';
import { useScreenSize } from '@utils';

import { DashboardZapCTA } from '../DeFiZap';
import { NotificationsPanel } from '../NotificationsPanel';
import {
  ActionTile,
  DashboardGas,
  MembershipPanel,
  RecentTransactionList,
  TokenPanel,
  WalletBreakdown
} from './components';
import { actions } from './constants';
import { filterDashboardActions } from './helpers';

import './Dashboard.scss';

// Keep the same mobile width as an ActionTile
const EmptyTile = styled.div`
  width: 30%;
`;

const DashboardWrapper = styled.div`
  width: 100%;
`;

export default function Dashboard() {
  const { featureFlags } = useFeatureFlags();
  const currentAccounts = useSelector(selectCurrentAccounts);
  const isMyCryptoMember = useSelector(getIsMyCryptoMember);
  const { accounts } = useAccounts();
  const { isMobile } = useScreenSize();
  const relevantActions = filterDashboardActions(actions, isMobile);

  return (
    <DashboardWrapper>
      {/* Mobile only */}
      <Mobile className="Dashboard-mobile">
        <NotificationsPanel accounts={accounts} />
        <div className="Dashboard-mobile-actions">
          {relevantActions.map((action) => (
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
          {featureFlags.MYC_MEMBERSHIP && isMyCryptoMember && (
            <div className="Dashboard-mobile-section Dashboard-mobile-tokenList">
              <MembershipPanel />
            </div>
          )}
          <div className="Dashboard-mobile-section Dashboard-mobile-tokenList">
            <TokenPanel />
          </div>
          <div className="Dashboard-mobile-section Dashboard-mobile-tokenList">
            <ActionPanel />
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
        {featureFlags.DEFIZAP && (
          <div className="Dashboard-mobile-section">
            <DashboardZapCTA className="Dashboard-mobile-modifiedPanel" />
          </div>
        )}
        {!isMyCryptoMember && <BannerAd />}
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
              {translateRaw('YOUR_DASHBOARD')}
            </Heading>
            <DashboardGas />
            {featureFlags.MYC_MEMBERSHIP && isMyCryptoMember && (
              <div className="Dashboard-desktop-top-left-token">
                <MembershipPanel />
              </div>
            )}
            <div className="Dashboard-desktop-top-left-actions">
              {relevantActions.map((action) => (
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
            {featureFlags.DEFIZAP && (
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
            <div>
              <ActionPanel />
            </div>
          </div>
        </div>
        {!isMyCryptoMember && <BannerAd />}
        <div className="Dashboard-desktop-bottom">
          <RecentTransactionList
            accountsList={currentAccounts}
            className="Dashboard-desktop-modifiedPanel"
          />
        </div>
      </Desktop>
    </DashboardWrapper>
  );
}
