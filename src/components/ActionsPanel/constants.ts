import { REPV1UUID, ROUTE_PATHS } from '@config';
import { State as StoreContextState } from '@services/Store/StoreProvider';
import translate, { translateRaw } from '@translations';
import { ACTION_CATEGORIES, ActionTemplate } from '@types';

import { ActionSubHead, ActionTable } from './components';

export const actionTemplates: ActionTemplate[] = [
  {
    name: 'update_label',
    heading: translateRaw('UPDATE_LABEL_ACTION_HEADING'),
    body: [translate('UPDATE_LABEL_ACTION_BODY_1'), translate('UPDATE_LABEL_ACTION_BODY_2')],
    priority: 0,
    button: {
      content: translateRaw('UPDATE_LABEL_ACTION_BUTTON'),
      to: ROUTE_PATHS.SETTINGS.path,
      external: false
    },
    category: ACTION_CATEGORIES.MYC_EXPERIENCE
  },
  {
    name: 'migrate_rep',
    heading: translateRaw('MIGRATE_REP_ACTION_HEADING'),
    subHeading: ActionSubHead,
    icon: 'rep-logo',
    body: [translate('MIGRATE_REP_ACTION_BODY')],
    filter: (state: StoreContextState) => state.assets().some((a) => a.uuid === REPV1UUID),
    priority: 30,
    Component: ActionTable,
    props: { assetUuid: REPV1UUID },
    button: {
      content: translateRaw('MIGRATE_REP_ACTION_BUTTON'),
      to: ROUTE_PATHS.REP_TOKEN_MIGRATION.path,
      external: false
    },
    category: ACTION_CATEGORIES.THIRD_PARTY
  }
];
