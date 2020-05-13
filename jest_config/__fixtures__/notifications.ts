import { ExtendedNotification } from '@types';

const notifications = [
  {
    uuid: 'dc6a487d-7c64-2bd4-1dfb-b3c79ec6388b',
    template: 'wallet-added',
    templateData: { address: '0xd06e395797e4abcd8b9cc2c44d88da8d24f9b2a2' },
    dateDisplayed: '2020-05-13T12:03:24.752Z',
    dismissed: true,
    dateDismissed: '2020-05-13T12:03:48.236Z'
  },
  {
    uuid: 'c6851864-1875-675d-5dff-6933e296100a',
    template: 'onboarding-responsible',
    templateData: { firstDashboardVisitDate: '2020-05-13T12:03:24.886Z' },
    dateDisplayed: '2020-05-13T12:03:24.887Z',
    dismissed: false
  },
  {
    uuid: '0f9766fd-d6c1-51f7-2c1c-abd8d3709996',
    template: 'wallet-not-added',
    templateData: { address: '0xd06e395797e4abcd8b9cc2c44d88da8d24f9b2a2' },
    dateDisplayed: '2020-05-13T12:03:48.236Z',
    dismissed: false
  }
];
export default (notifications as any) as ExtendedNotification[];
