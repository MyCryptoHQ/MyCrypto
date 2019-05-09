export interface NotificationConfig {
  analyticsEvent: string;
  showOneTime: boolean;
  dismissOnOverwrite: boolean;
  layout: any;
  repeatInterval?: number;
  condition?(): boolean;
}

export interface NotificationsConfigsProps {
  [key: string]: NotificationConfig;
}
