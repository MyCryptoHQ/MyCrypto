import moment from 'moment';

import { ExtendedNotification } from '@types';

export const saveSettingsCheck = (): boolean => {
  // TODO: Check if all additional conditions are met for displaying the "save settings" notification
  return true;
};

export const printPaperWalletCheck = (): boolean => {
  // TODO: Check if all additional conditions are met for displaying the "print paper wallet" notification
  return true;
};

export const getHardwareWalletCheck = (): boolean => {
  // TODO: Check if all additional conditions are met for displaying the "get hardware wallet" notification
  return true;
};

export const onboardingPleaseUnderstandCheck = (notification: ExtendedNotification): boolean => {
  if (!notification.templateData) {
    return false;
  }
  return (
    moment
      .duration(
        moment(new Date()).diff(moment(notification.templateData.previousNotificationClosedDate))
      )
      .asDays() > 1
  );
};

export const onboardingResponsibleCheck = (notification: ExtendedNotification): boolean => {
  if (!notification.templateData) {
    return false;
  }
  return (
    moment
      .duration(moment(new Date()).diff(moment(notification.templateData.firstDashboardVisitDate)))
      .asDays() > 1
  );
};
