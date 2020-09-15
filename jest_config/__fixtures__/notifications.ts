import { ExtendedNotification, TUuid } from '@types';

export const fNotifications: ExtendedNotification[] = [
  {
    dateDismissed: new Date('2020-09-15T09:52:55.145Z'),
    dateDisplayed: new Date('2020-09-15T09:52:52.198Z'),
    dismissed: true,
    template: 'onboarding-responsible',
    templateData: { firstDashboardVisitDate: '2020-09-11T15:15:39.511Z' },
    uuid: '9a7f9e65-9ad3-7e58-01b4-06f81d98fcff' as TUuid
  },
  {
    dateDismissed: new Date('2020-09-15T09:53:02.228Z'),
    dateDisplayed: new Date('2020-09-15T09:52:57.345Z'),
    dismissed: true,
    template: 'wallet-created',
    templateData: { address: 'N3WAddre3ssCreated' },
    uuid: '250896db-8e89-db5b-c90e-100770f46cb2' as TUuid
  }
];
