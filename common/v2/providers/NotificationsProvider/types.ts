export interface NotificationConfig {
  analyticsEvent: string;
  layout: any;
  showOneTime?: boolean;
  dismissOnOverwrite?: boolean;
  dismissForever?: boolean;
  repeatInterval?: number;
  condition?(): boolean;
}

export interface NotificationsConfigsProps {
  [key: string]: NotificationConfig;
}
