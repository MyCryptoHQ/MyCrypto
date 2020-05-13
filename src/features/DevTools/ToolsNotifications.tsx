import React from 'react';
import styled from 'styled-components';
import { COLORS } from '@theme';

import { useNotifications } from '@features/NotificationsPanel';

const ToolWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  width: 100%;
  padding: 8px;
  border: 1px solid ${COLORS.GREY_LIGHTEST};
`;

const ToolsNotifications = () => {
  const { displayNotification, templates } = useNotifications();
  return (
    <ToolWrapper>
      <p>
        <b>Dashboard notifications</b>
      </p>
      <button
        onClick={() => {
          displayNotification(templates.walletCreated, {
            address: 'N3WAddre3ssCreated'
          });
        }}
      >
        New Wallet Created
      </button>{' '}
      <button
        onClick={() => {
          displayNotification(templates.walletAdded, {
            address: 'N3WAddr3ssAdd3d'
          });
        }}
      >
        New Wallet Added
      </button>{' '}
      <button
        onClick={() => {
          displayNotification(templates.saveSettings);
        }}
      >
        Save Settings
      </button>{' '}
      <button
        onClick={() => {
          displayNotification(templates.printPaperWallet, {
            address: 'N3WAddre3ssCreatedPap3r',
            privateKey: 'Privat3K3y'
          });
        }}
      >
        Print Paper Wallet
      </button>{' '}
      <button
        onClick={() => {
          displayNotification(templates.getHardwareWallet);
        }}
      >
        Get Hardware Wallet
      </button>
      <button
        onClick={() => {
          displayNotification(templates.onboardingPleaseUnderstand, {
            previousNotificationClosedDate: new Date()
          });
        }}
      >
        Onboarding Please Understand
      </button>
      <button
        onClick={() => {
          displayNotification(templates.onboardingResponsible, {
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
