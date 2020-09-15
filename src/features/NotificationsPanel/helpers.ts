import { ExtendedNotification } from '@types';
import { getDayDifference } from '@utils';

export const saveSettingsCheck = (): boolean => {
  // @todo: Check if all additional conditions are met for displaying the "save settings" notification
  return true;
};

export const printPaperWalletCheck = (): boolean => {
  // @todo: Check if all additional conditions are met for displaying the "print paper wallet" notification
  return true;
};

export const getHardwareWalletCheck = (): boolean => {
  // @todo: Check if all additional conditions are met for displaying the "get hardware wallet" notification
  return true;
};

export const onboardingPleaseUnderstandCheck = (notification: ExtendedNotification): boolean => {
  if (!notification.templateData) {
    return false;
  }

  return getDayDifference(notification.templateData.previousNotificationClosedDate) > 1;
};

export const onboardingResponsibleCheck = (notification: ExtendedNotification): boolean => {
  if (!notification.templateData) {
    return false;
  }

  return getDayDifference(notification.templateData.firstDashboardVisitDate) > 1;
};
