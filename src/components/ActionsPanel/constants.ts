import { add, isBefore } from 'date-fns';

import {
  ETHUUID,
  EXT_URLS,
  REPV1UUID,
  ROUTE_PATHS,
  socialMediaLinks,
  SUBSCRIBE_NEWSLETTER_LINK,
  UNISWAP_LINK
} from '@config';
import { ClaimState } from '@services/ApiService/Uniswap/Uniswap';
import { State as StoreContextState } from '@services/Store/StoreProvider';
import translate, { translateRaw } from '@translations';
import { ACTION_CATEGORIES, ActionTemplate } from '@types';
import { formatSupportEmail, isHardwareWallet } from '@utils';

import { MigrationSubHead, MigrationTable, UniClaimSubHead, UniClaimTable } from './components';

export const actionTemplates: ActionTemplate[] = [
  {
    name: 'update_label',
    icon: 'experience',
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
    subHeading: MigrationSubHead,
    icon: 'rep-logo',
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
    icon: 'uni-logo',
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
  },
  {
    name: 'renew_ens',
    heading: translateRaw('RENEW_ENS_ACTION_HEADING'),
    icon: 'ensLogo',
    filter: (state: StoreContextState) =>
      state.ensOwnershipRecords.some((r) =>
        isBefore(new Date(r.expiryDate), add(new Date(), { days: 60 }))
      ),
    body: [translate('RENEW_ENS_ACTION_BODY')],
    priority: 30,
    button: {
      content: translateRaw('RENEW_ENS_ACTION_BUTTON'),
      to: ROUTE_PATHS.ENS.path,
      external: false
    },
    category: ACTION_CATEGORIES.THIRD_PARTY
  },
  {
    name: 'buy_hw',
    heading: translateRaw('BUY_HW_ACTION_HEADING'),
    icon: 'ledger-icon',
    body: [translate('BUY_HW_ACTION_BODY')],
    filter: (state: StoreContextState) => !state.accounts.some((c) => isHardwareWallet(c.wallet)),
    priority: 30,
    button: {
      content: translateRaw('BUY_HW_ACTION_BUTTON'),
      to: EXT_URLS.LEDGER_REFERRAL.url,
      external: true
    },
    category: ACTION_CATEGORIES.SECURITY
  },
  {
    name: 'myc_membership',
    heading: translateRaw('MYC_MEMBERSHIP_ACTION_HEADING'),
    icon: 'membership',
    body: [translate('MYC_MEMBERSHIP_ACTION_BODY')],
    filter: (state: StoreContextState) => !state.isMyCryptoMember,
    priority: 0,
    button: {
      content: translateRaw('MYC_MEMBERSHIP_ACTION_BUTTON'),
      to: ROUTE_PATHS.MYC_MEMBERSHIP.path,
      external: false
    },
    category: ACTION_CATEGORIES.SELF_LOVE
  },
  {
    name: 'add_account',
    heading: translateRaw('ADD_ACCOUNT_ACTION_HEADING'),
    icon: 'experience',
    body: [translate('ADD_ACCOUNT_ACTION_BODY')],
    filter: (state: StoreContextState) => state.accounts.length < 3,
    priority: 0,
    button: {
      content: translateRaw('ADD_ACCOUNT_ACTION_BUTTON'),
      to: ROUTE_PATHS.ADD_ACCOUNT.path,
      external: false
    },
    category: ACTION_CATEGORIES.MYC_EXPERIENCE
  },
  {
    name: 'backup',
    heading: translateRaw('BACKUP_ACTION_HEADING'),
    icon: 'experience',
    body: [translate('BACKUP_ACTION_BODY')],
    filter: (state: StoreContextState) => state.accounts.length >= 3,
    priority: 0,
    button: {
      content: translateRaw('BACKUP_ACTION_BUTTON'),
      to: ROUTE_PATHS.SETTINGS_EXPORT.path,
      external: false
    },
    category: ACTION_CATEGORIES.MYC_EXPERIENCE
  },
  {
    name: 'feedback',
    heading: translateRaw('FEEDBACK_ACTION_HEADING'),
    icon: 'feedback',
    body: [translate('FEEDBACK_ACTION_BODY_1'), translate('FEEDBACK_ACTION_BODY_2')],
    priority: 0,
    button: {
      content: translateRaw('FEEDBACK_ACTION_BUTTON'),
      to: formatSupportEmail(translateRaw('FEEDBACK_ACTION_MAIL_SUBJECT')),
      external: true
    },
    category: ACTION_CATEGORIES.OTHER
  },
  {
    name: 'newsletter',
    heading: translateRaw('NEWSLETTER_ACTION_HEADING'),
    icon: 'newsletter',
    body: [translate('NEWSLETTER_ACTION_BODY')],
    priority: 0,
    button: {
      content: translateRaw('NEWSLETTER_ACTION_BUTTON'),
      to: SUBSCRIBE_NEWSLETTER_LINK,
      external: true
    },
    category: ACTION_CATEGORIES.OTHER
  },
  {
    name: 'telegram',
    heading: translateRaw('TELEGRAM_ACTION_HEADING'),
    icon: 'telegram-icon',
    body: [translate('TELEGRAM_ACTION_BODY')],
    priority: 0,
    button: {
      content: translateRaw('TELEGRAM_ACTION_BUTTON'),
      to: socialMediaLinks.find((i) => i.text === 'telegram')!.link,
      external: true
    },
    category: ACTION_CATEGORIES.OTHER
  },
  {
    name: 'swap',
    heading: translateRaw('SWAP_ACTION_HEADING'),
    icon: 'swap',
    body: [translate('SWAP_ACTION_BODY')],
    filter: (state: StoreContextState) =>
      state.assets().some((a) => a.uuid === ETHUUID) &&
      state.assets().some((a) => a.uuid !== ETHUUID),
    priority: 0,
    button: {
      content: translateRaw('SWAP_ACTION_BUTTON'),
      to: ROUTE_PATHS.SWAP.path,
      external: false
    },
    category: ACTION_CATEGORIES.OTHER
  },
  {
    name: 'twitter',
    heading: translateRaw('TWITTER_ACTION_HEADING'),
    icon: 'twitter-icon',
    body: [translate('TWITTER_ACTION_BODY')],
    priority: 0,
    button: {
      content: translateRaw('TWITTER_ACTION_BUTTON'),
      to: socialMediaLinks.find((i) => i.text === 'twitter')!.link,
      external: true
    },
    category: ACTION_CATEGORIES.OTHER
  }
];
