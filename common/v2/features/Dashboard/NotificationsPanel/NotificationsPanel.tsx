import React, { Component } from 'react';
import { Panel, Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { BREAK_POINTS } from 'v2/features/constants';
import { NotificationsContext, notificationsConfigs } from 'v2/providers/NotificationsProvider';
import { Notification } from 'v2/services/Notifications';

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
      <NotificationsContext.Consumer>
        {({ currentNotification, dismissCurrentNotification }) => (
          <React.Fragment>
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
    );
  }

  private getNotification(currentNotification: Notification) {
    const template = currentNotification.template;
    const templateData = currentNotification.templateData;
    const NotificationComponent = notificationsConfigs[template].layout;
    return <NotificationComponent {...templateData} />;
  }
}

export default NotificationsPanel;
