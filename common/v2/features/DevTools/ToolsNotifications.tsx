import React from 'react';
import styled from 'styled-components';

import { NotificationsContext, NotificationTemplates } from 'v2/providers/NotificationsProvider';

const ToolWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  width: 100%;
  backround: white;
  padding: 8px;
  border: 1px solid silver;
`;

const ToolsNotifications = () => {
  return (
    <NotificationsContext.Consumer>
      {({ displayNotification }) => (
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
        </ToolWrapper>
      )}
    </NotificationsContext.Consumer>
  );
};

export default ToolsNotifications;
