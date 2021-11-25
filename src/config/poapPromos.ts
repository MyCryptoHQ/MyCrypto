import { NotificationTemplates } from '@types';

export const PROMO_CONFIG = [
  {
    key: 'halloween2021',
    startDate: new Date('Wed Oct 31 2021 07:00:00 PST'),
    endDate: new Date('Fri Nov 5 2021 07:00:00 PST')
  },
  {
    key: 'winter2021',
    notification: NotificationTemplates.winterPoap,
    startDate: new Date('Wed Dec 1 2021 07:00:00 PST'),
    endDate: new Date('Fri Dec 31 2021 23:59:00 PST')
  }
];
