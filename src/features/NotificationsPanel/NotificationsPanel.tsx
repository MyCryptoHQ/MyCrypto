import React from 'react';

import { Button, Panel } from '@mycrypto/ui';
import styled from 'styled-components';

import closeIcon from '@assets/images/icn-close.svg';
import { SPACING } from '@theme';
import { IAccount } from '@types';
import { useEffectOnce } from '@vendor';

import { notificationsConfigs, NotificationTemplates } from './constants';
import { useNotifications } from './useNotifications';

export const MainPanel = styled(Panel)`
  position: relative;
  padding: ${SPACING.MD};
  margin-bottom: ${SPACING.BASE};
`;

export const CloseButton = styled(Button)`
  position: absolute;
  right: 17px;
  top: 6px;
  img {
    width: 13px;
    height: 13px;
  }
`;

interface Props {
  accounts: IAccount[];
}

const NotificationsPanel = ({ accounts }: Props) => {
  const {
    notifications,
    displayNotification,
    currentNotification,
    dismissCurrentNotification,
    trackNotificationViewed
  } = useNotifications();

  useEffectOnce(() => {
    trackNotificationViewed();
  });

  const handleCloseClick = () => {
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

  if (
    !notifications.find((x) => x.template === NotificationTemplates.onboardingResponsible) &&
    accounts.length > 0
  ) {
    displayNotification(NotificationTemplates.onboardingResponsible, {
      firstDashboardVisitDate: new Date()
    });
  }

  const getNotificationBody = () => {
    const template = currentNotification!.template;
    const templateData = currentNotification!.templateData;
    const NotificationComponent = notificationsConfigs[template].layout;
    return <NotificationComponent {...templateData} />;
  };

  return (
    <React.Fragment>
      {currentNotification && (
        <MainPanel>
          <CloseButton basic={true} onClick={handleCloseClick}>
            <img src={closeIcon} alt="Close" />
          </CloseButton>
          {getNotificationBody()}
        </MainPanel>
      )}
    </React.Fragment>
  );
};

export default NotificationsPanel;
