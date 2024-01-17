import { Fragment } from 'react';

import { Button, Panel } from '@mycrypto/ui';
import styled from 'styled-components';

import closeIcon from '@assets/images/icn-close.svg';
import { SPACING } from '@theme';
import { IAccount, NotificationTemplates } from '@types';
import { useScreenSize } from '@utils';
import { useEffectOnce } from '@vendor';

import { notificationsConfigs } from './constants';
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

  const template = currentNotification?.template;

  const { isMobile } = useScreenSize();
  const config = notificationsConfigs[template];

  const getNotificationBody = () => {
    const templateData = currentNotification!.templateData;
    const NotificationComponent = config.layout;
    return <NotificationComponent {...templateData} />;
  };

  const style = config && config.style ? config.style(isMobile) : undefined;

  return (
    <Fragment>
      {currentNotification && config && (
        <MainPanel style={style}>
          <CloseButton basic={true} onClick={handleCloseClick}>
            <img src={closeIcon} alt="Close" />
          </CloseButton>
          {getNotificationBody()}
        </MainPanel>
      )}
    </Fragment>
  );
};

export default NotificationsPanel;
