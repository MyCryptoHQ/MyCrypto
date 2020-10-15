import { ROUTE_PATHS } from '@config';
import translate, { translateRaw } from '@translations';
import { ACTION_CATEGORIES, ActionTemplate } from '@types';

export const actionTemplates: ActionTemplate[] = [
  {
    name: 'update_label',
    heading: translateRaw('UPDATE_LABEL_ACTION_HEADING'),
    body: [translate('UPDATE_LABEL_ACTION_BODY_1'), translate('UPDATE_LABEL_ACTION_BODY_2')],
    shouldDisplay: true,
    priority: 0,
    button: {
      content: translateRaw('UPDATE_LABEL_ACTION_BUTTON'),
      to: ROUTE_PATHS.SETTINGS.path,
      external: false
    },
    category: ACTION_CATEGORIES.MYC_EXPERIENCE
  }
];
