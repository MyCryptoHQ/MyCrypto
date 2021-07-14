import { FC } from 'react';

import closeIcon from '@assets/images/icn-close.svg';
import { fAccount } from '@fixtures';
import { noOp } from '@utils';

import {
  GetHardwareWalletNotification,
  OnboardingPleaseUnderstandNotification,
  OnboardingResponsibleNotification,
  SaveDashboardNotification,
  WalletAddedNotification,
  WalletCreatedNotification,
  WalletNotAddedNotification
} from './components';
import { CloseButton, MainPanel } from './NotificationsPanel';

export default { title: 'Molecules/Notifications', component: MainPanel };

const NotificationPanel: FC = ({ children }) => (
  <div style={{ width: '100%', maxWidth: '1200px' }}>
    <MainPanel>
      <CloseButton basic={true} onClick={noOp}>
        <img src={closeIcon} alt="Close" />
      </CloseButton>
      {children}
    </MainPanel>
  </div>
);

export const walletCreatedNotification = () => (
  <NotificationPanel>
    <WalletCreatedNotification address={fAccount.address} />
  </NotificationPanel>
);

export const walletAddedNotification = () => (
  <NotificationPanel>
    <WalletAddedNotification address={fAccount.address} />
  </NotificationPanel>
);

export const saveDashboardNotification = () => (
  <NotificationPanel>
    <SaveDashboardNotification />
  </NotificationPanel>
);

export const getHardwareWalletNotification = () => (
  <NotificationPanel>
    <GetHardwareWalletNotification />
  </NotificationPanel>
);

export const walletNotAddedNotification = () => (
  <NotificationPanel>
    <WalletNotAddedNotification address={fAccount.address} />
  </NotificationPanel>
);

export const onboardingPleaseUnderstandNotification = () => (
  <NotificationPanel>
    <OnboardingPleaseUnderstandNotification />
  </NotificationPanel>
);

export const onboardingResponsibleNotification = () => (
  <NotificationPanel>
    <OnboardingResponsibleNotification />
  </NotificationPanel>
);
