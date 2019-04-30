import React, { Component } from 'react';
import { Panel, Button } from '@mycrypto/ui';
import styled from 'styled-components';

import {
  WalletCreatedNotification,
  WalletAddedNotification,
  SaveDashboardNotification,
  PrintPaperWalletNotification,
  GetHardwareWalletNotification
} from './components';
import { BREAK_POINTS } from 'v2/features/constants';
import { NotificationsContext, NotificationsProvider } from 'v2/providers';
import { Notification, NotificationTemplates } from 'v2/services/Notifications';

// Legacy
import closeIcon from 'common/assets/images/icn-close.svg';

const { SCREEN_MD } = BREAK_POINTS;

const MainPanel = styled(Panel)`
  position: relative;
  margin-left: 15px;
  margin-right: 15px;

  @media (min-width: ${SCREEN_MD}) {
    margin: 0 0 50px 0;
  }
`;

const CloseButton = styled(Button)`
  position: absolute;
  right: 17px;
  top: 6px;
  img {
    width: 13px;
    height: 13px;
  }
`;

class NotificationsPanel extends Component {
  public render() {
    return (
      <NotificationsProvider>
        <NotificationsContext.Consumer>
          {({ createNotification, currentNotification, dismissCurrentNotification }) => (
            <React.Fragment>
              <div style={{ marginBottom: '18px' }}>
                <button
                  onClick={() => {
                    createNotification(NotificationTemplates.walletCreated, {
                      templateData: { address: 'N3WAddre3ssCreated' }
                    });
                  }}
                >
                  New Wallet Created
                </button>{' '}
                <button
                  onClick={() => {
                    createNotification(NotificationTemplates.walletAdded, {
                      templateData: { address: 'N3WAddr3ssAdd3d' }
                    });
                  }}
                >
                  New Wallet Added
                </button>{' '}
                <button
                  onClick={() => {
                    createNotification(NotificationTemplates.saveSettings);
                  }}
                >
                  Save Settings
                </button>{' '}
                <button
                  onClick={() => {
                    createNotification(NotificationTemplates.printPaperWallet, {
                      dismissOnOverwrite: false,
                      templateData: { address: 'N3WAddre3ssCreatedPap3r' }
                    });
                  }}
                >
                  Print Paper Wallet
                </button>{' '}
                <button
                  onClick={() => {
                    createNotification(NotificationTemplates.getHardwareWallet, {
                      dismissOnOverwrite: false
                    });
                  }}
                >
                  Get Hardware Wallet
                </button>
              </div>
              {currentNotification && (
                <MainPanel>
                  <CloseButton basic={true} onClick={dismissCurrentNotification}>
                    <img src={closeIcon} alt="Close" />
                  </CloseButton>
                  {this.getNotification(currentNotification)}
                </MainPanel>
              )}
            </React.Fragment>
          )}
        </NotificationsContext.Consumer>
      </NotificationsProvider>
    );
  }

  private getNotification(currentNotification: Notification) {
    const template = currentNotification.template;
    const templateData = currentNotification.options.templateData;

    switch (template) {
      case NotificationTemplates.walletCreated:
        return <WalletCreatedNotification />;
      case NotificationTemplates.walletAdded:
        return <WalletAddedNotification />;
      case NotificationTemplates.saveSettings:
        return <SaveDashboardNotification />;
      case NotificationTemplates.printPaperWallet:
        return (
          <PrintPaperWalletNotification
            address={templateData && templateData.address}
            privateKey={'023o1j23iohfse'}
          />
        );
      case NotificationTemplates.getHardwareWallet:
        return <GetHardwareWalletNotification />;
      default:
        return <WalletCreatedNotification />;
    }
  }
}

export default NotificationsPanel;
