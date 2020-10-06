import { ROUTE_PATHS } from '@config';
import { ACTION_CATEGORIES, ActionTemplate } from '@types';

export const actionTemplates: ActionTemplate[] = [
  {
    name: 'update_label',
    heading: 'Update a label for your past transactions',
    body: [
      "Labels are the bee's knees. They can help you recall the purpose of a past transaction. They can act as a check that you are sending to the correct address. But, most importantly, they're yours. They're private. They live only in your browser, not our servers.",
      'You can add/update a label almost anywhere you see an address on MyCrypto, like in your Accounts list or Address book.'
    ],
    shouldDisplay: () => true,
    priority: 0,
    button: {
      content: 'Label an address',
      to: ROUTE_PATHS.SETTINGS.path,
      external: false
    },
    category: ACTION_CATEGORIES.MYC_EXPERIENCE
  }
];
