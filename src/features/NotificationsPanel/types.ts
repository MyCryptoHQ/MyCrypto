import { CSSProperties } from 'react';

import { ExtendedNotification } from '@types';

export interface NotificationConfig {
  analyticsEvent: string;
  layout: any;
  showOneTime?: boolean;
  dismissOnOverwrite?: boolean;
  dismissForever?: boolean;
  repeatInterval?: number;
  preventDismisExisting?: boolean;
  condition?(notification: ExtendedNotification): boolean;
  style?(isMobile: boolean): CSSProperties;
  priority?: boolean; // Is sorted above any other notifications
}

export interface NotificationsConfigsProps {
  [key: string]: NotificationConfig;
}
