import { PROMO_CONFIG } from '@config';
import { ExtendedNotification } from '@types';
import { dateIsBetween, getDayDifference } from '@utils';

export const saveSettingsCheck = (): boolean => {
  // @todo: Check if all additional conditions are met for displaying the "save settings" notification
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

export const promoPoapCheck = (): boolean => {
  const config = PROMO_CONFIG.find((c) => c.key === 'winter2021');
  if (!config) {
    return false;
  }
  return dateIsBetween(config.startDate, config.endDate, Date.now() / 1000);
};
