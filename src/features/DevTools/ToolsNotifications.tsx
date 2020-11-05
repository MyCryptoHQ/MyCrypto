import React from 'react';

import styled from 'styled-components';

import { NotificationTemplates, useNotifications } from '@features/NotificationsPanel';

const ToolWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  width: 100%;
  margin-bottom: 1em;
`;

const ToolsNotifications = () => {
  const { displayNotification } = useNotifications();
  return (
    <ToolWrapper>
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
