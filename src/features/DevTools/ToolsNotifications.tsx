import React from 'react';
import styled from 'styled-components';
import { COLORS } from '@theme';

import { useNotifications, NotificationTemplates } from '@features/NotificationsPanel';

const ToolWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  width: 100%;
  padding: 8px;
  border: 1px solid ${COLORS.GREY_LIGHTEST};
`;

const ToolsNotifications = () => {
  const { displayNotification } = useNotifications();
  return (
    <ToolWrapper>
      <p>
        <b>Dashboard notifications</b>
      </p>
      <button
        onClick={() => {
          displayNotification(NotificationTemplates.walletCreated, {
            address: 'N3WAddre3ssCreated'
          });
        }}
      >
        New Wallet Created
      </button>{' '}
      <button
        onClick={() => {
          displayNotification(NotificationTemplates.walletAdded, {
            address: 'N3WAddr3ssAdd3d'
          });
        }}
      >
        New Wallet Added
      </button>{' '}
      <button
        onClick={() => {
          displayNotification(NotificationTemplates.saveSettings);
        }}
      >
        Save Settings
      </button>{' '}
      <button
        onClick={() => {
          displayNotification(NotificationTemplates.printPaperWallet, {
            address: 'N3WAddre3ssCreatedPap3r',
            privateKey: 'Privat3K3y'
          });
        }}
      >
        Print Paper Wallet
      </button>{' '}
      <button
        onClick={() => {
          displayNotification(NotificationTemplates.getHardwareWallet);
        }}
      >
        Get Hardware Wallet
      </button>
      <button
        onClick={() => {
          displayNotification(NotificationTemplates.onboardingPleaseUnderstand, {
            previousNotificationClosedDate: new Date()
          });
        }}
      >
        Onboarding Please Understand
      </button>
      <button
        onClick={() => {
          displayNotification(NotificationTemplates.onboardingResponsible, {
            firstDashboardVisitDate: new Date()
          });
        }}
      >
        Onboarding Responsible
      </button>
    </ToolWrapper>
  );
};

export default ToolsNotifications;
