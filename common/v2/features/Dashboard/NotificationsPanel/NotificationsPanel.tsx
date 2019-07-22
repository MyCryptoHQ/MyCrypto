import React, { Component } from 'react';
import { Panel, Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { BREAK_POINTS } from 'v2/theme';
import {
  NotificationsContext,
  notificationsConfigs,
  NotificationTemplates
} from 'v2/providers/NotificationsProvider';
import { Notification } from 'v2/types';

// Legacy
import closeIcon from 'common/assets/images/icn-close.svg';

const { SCREEN_MD } = BREAK_POINTS;

const MainPanel = styled(Panel)`
  position: relative;
  margin-left: 15px;
  margin-right: 15px;
  padding-left: 25px;
  padding-right: 25px;

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
  public handleCloseClick = (
    currentNotification: Notification,
    dismissCurrentNotification: () => void,
    displayNotification: (templateName: string, templateData?: object) => void
  ) => {
    if (!currentNotification) {
      return;
    }

    switch (currentNotification.template) {
      case NotificationTemplates.onboardingResponsible: {
        /*  Trigger "please understand" notification after "onboarding responsible" notification.
            "previousNotificationClosedDate" is later used to show the "please understand" notification
             with a delay after the current one has been dismissed.
        */
        dismissCurrentNotification();
        displayNotification(NotificationTemplates.onboardingPleaseUnderstand, {
          previousNotificationClosedDate: new Date()
        });
        break;
      }
      default: {
        dismissCurrentNotification();
        break;
      }
    }
  };

  public render() {
    return (
      <NotificationsContext.Consumer>
        {({ currentNotification, dismissCurrentNotification, displayNotification }) => (
          <React.Fragment>
            {currentNotification && (
              <MainPanel>
                <CloseButton
                  basic={true}
                  onClick={() =>
                    this.handleCloseClick(
                      currentNotification,
                      dismissCurrentNotification,
                      displayNotification
                    )
                  }
                >
                  <img src={closeIcon} alt="Close" />
                </CloseButton>
                {this.getNotificationBody(currentNotification)}
              </MainPanel>
            )}
          </React.Fragment>
        )}
      </NotificationsContext.Consumer>
    );
  }

  private getNotificationBody(currentNotification: Notification) {
    const template = currentNotification.template;
    const templateData = currentNotification.templateData;
    const NotificationComponent = notificationsConfigs[template].layout;
    return <NotificationComponent {...templateData} />;
  }
}

export default NotificationsPanel;
