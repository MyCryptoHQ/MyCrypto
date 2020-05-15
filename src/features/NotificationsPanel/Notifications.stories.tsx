import React, { FC } from 'react';

import { fAccount } from '@fixtures';
import { noOp } from '@utils';

import {
  WalletCreatedNotification,
  WalletAddedNotification,
  SaveDashboardNotification,
  PrintPaperWalletNotification,
  GetHardwareWalletNotification,
  WalletNotAddedNotification,
  OnboardingPleaseUnderstandNotification,
  OnboardingResponsibleNotification
} from './components';
import { MainPanel, CloseButton } from './NotificationsPanel';

// Legacy
import closeIcon from '@assets/images/icn-close.svg';

export default { title: 'Notifications' };

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

export const printPaperWalletNotification = () => (
  <NotificationPanel>
    <PrintPaperWalletNotification address={fAccount.address} privateKey="privateKey" />
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
