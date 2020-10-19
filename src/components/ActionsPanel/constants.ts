import repIcon from '@assets/images/rep-logo.svg';
import uniIcon from '@assets/images/uni-logo.png';
import { REPV1UUID, ROUTE_PATHS, UNISWAP_LINK } from '@config';
import { ClaimState } from '@services/ApiService/Uniswap/Uniswap';
import { State as StoreContextState } from '@services/Store/StoreProvider';
import translate, { translateRaw } from '@translations';
import { ACTION_CATEGORIES, ActionTemplate } from '@types';

import { MigrationSubHead, MigrationTable, UniClaimSubHead, UniClaimTable } from './components';

export const actionTemplates: ActionTemplate[] = [
  {
    name: 'migrate_rep',
    heading: translateRaw('MIGRATE_REP_ACTION_HEADING'),
    subHeading: MigrationSubHead,
    icon: repIcon,
    body: [translate('MIGRATE_REP_ACTION_BODY')],
    filter: (state: StoreContextState) => state.assets().some((a) => a.uuid === REPV1UUID),
    priority: 30,
    Component: MigrationTable,
    props: { assetUuid: REPV1UUID },
    button: {
      content: translateRaw('MIGRATE_REP_ACTION_BUTTON'),
      to: ROUTE_PATHS.REP_TOKEN_MIGRATION.path,
      external: false
    },
    category: ACTION_CATEGORIES.MIGRATION
  },
  {
    name: 'claim_uni',
    heading: translateRaw('CLAIM_UNI_ACTION_HEADING'),
    icon: uniIcon,
    subHeading: UniClaimSubHead,
    body: [translate('CLAIM_UNI_ACTION_BODY')],
    filter: (state: StoreContextState) =>
      state.uniClaims.some((c) => c.state === ClaimState.UNCLAIMED),
    priority: 30,
    Component: UniClaimTable,
    button: {
      content: translateRaw('CLAIM_UNI_ACTION_BUTTON'),
      to: UNISWAP_LINK,
      external: true
    },
    category: ACTION_CATEGORIES.THIRD_PARTY
  }
];
