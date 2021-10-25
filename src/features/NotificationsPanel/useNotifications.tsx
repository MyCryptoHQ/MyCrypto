import {
  displayNotification as displayNotificationRedux,
  selectNotifications,
  updateNotification,
  useDispatch,
  useSelector
} from '@store';
import { ExtendedNotification } from '@types';
import { getTimeDifference, notUndefined } from '@utils';

import { notificationsConfigs } from './constants';

export interface ProviderState {
  currentNotification: ExtendedNotification | undefined;
  notifications: ExtendedNotification[];
  displayNotification(templateName: string, templateData?: TObject): void;
  dismissCurrentNotification(): void;
}

function getCurrent(notifications: ExtendedNotification[]) {
  const latest = (a: ExtendedNotification, b: ExtendedNotification) => {
    if (notificationsConfigs[a.template].priority) {
      return -1;
    } else if (notificationsConfigs[b.template].priority) {
      return 1;
    }
    return new Date(b.dateDisplayed).getTime() - new Date(a.dateDisplayed).getTime();
  };

  const canDisplay = (n: ExtendedNotification): boolean => {
    return (
      !n.dismissed &&
      (notificationsConfigs[n.template]?.condition
        ? notificationsConfigs[n.template].condition!(n)
        : true)
    );
  };

  const result = notifications.filter(canDisplay).sort(latest);
  return result[0];
}

function isValidNotification(n: ExtendedNotification) {
  const config = notificationsConfigs[n.template];

  // Check conditions for repeating and non-repeating notifications, show notification if needed
  const shouldShowRepeatingNotification =
    config.repeatInterval &&
    n.dismissed &&
    config.repeatInterval <= getTimeDifference(n.dateDismissed ?? 0);
  const isNonrepeatingNotification = !config.repeatInterval && !n.dismissed;
  const isConfigCondition = config.condition && config.condition(n);

  return isConfigCondition && (shouldShowRepeatingNotification || isNonrepeatingNotification);
}

export function useNotifications() {
  const notifications = useSelector(selectNotifications);

  const currentNotification = getCurrent(notifications);
  const dispatch = useDispatch();

  const displayNotification = (templateName: string, templateData?: TObject) => {
    dispatch(displayNotificationRedux({ templateName, templateData }));
  };

  const dismissNotification = (notif?: ExtendedNotification) => {
    if (notUndefined(notif)) {
      dispatch(
        updateNotification({
          ...notif,
          dismissed: true,
          dateDismissed: new Date()
        })
      );
    }
  };

  const dismissCurrentNotification = () => dismissNotification(currentNotification);

  const trackNotificationViewed = () => {
    if (currentNotification) {
      // Hide notifications that should be shown only once and update notifications that should be displayed again
      notifications.forEach((n) => {
        const config = notificationsConfigs[n.template];
        if (config.showOneTime && !n.dismissed && n.viewed) {
          dismissNotification(n);
        } else if (isValidNotification(n)) {
          dispatch(
            updateNotification({
              ...n,
              dismissed: false,
              dateDisplayed: new Date()
            })
          );
        }
      });

      if (!currentNotification.viewed) {
        dispatch(
          updateNotification({
            ...currentNotification,
            viewed: true
          })
        );
      }
    }
  };

  return {
    notifications,
    currentNotification,
    displayNotification,
    dismissNotification,
    dismissCurrentNotification,
    trackNotificationViewed
  };
}
