import { ExtendedNotification } from 'v2/services';

export interface NotificationConfig {
  analyticsEvent: string;
  layout: any;
  showOneTime?: boolean;
  dismissOnOverwrite?: boolean;
  dismissForever?: boolean;
  repeatInterval?: number;
  preventDismisExisting?: boolean;
  condition?(notification: ExtendedNotification): boolean;
}

export interface NotificationsConfigsProps {
  [key: string]: NotificationConfig;
}
