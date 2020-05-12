import { TUuid } from './uuid';

export interface Notification {
  template: string;
  templateData?: { [key: string]: any };
  dateDisplayed: Date;
  dismissed: boolean;
  dateDismissed: Date | undefined;
}

export interface ExtendedNotification extends Notification {
  uuid: TUuid;
}
