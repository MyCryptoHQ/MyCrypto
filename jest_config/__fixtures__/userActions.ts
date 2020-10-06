import { ACTION_CATEGORIES, ActionTemplate, ExtendedUserAction, TUuid } from '@types';

export const fActionTemplates: ActionTemplate[] = [
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
      to: '/settings',
      external: false
    },
    category: 'mycExperience' as ACTION_CATEGORIES
  }
];

export const fUserActions: ExtendedUserAction[] = [
  {
    uuid: '19345669-8bad-4597-b541-02486696fcc1' as TUuid,
    name: 'update_label',
    state: 'new'
  }
];
