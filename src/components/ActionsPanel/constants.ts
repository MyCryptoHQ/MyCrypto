import { add, isBefore } from 'date-fns';

import { TIcon } from '@components';
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
import { ACTION_CATEGORIES, ACTION_NAME, ActionTemplate } from '@types';
import { formatSupportEmail, isHardwareWallet, randomElementFromArray } from '@utils';

import { MigrationSubHead, MigrationTable, UniClaimSubHead, UniClaimTable } from './components';

interface IHwWalletElement {
  icon: TIcon;
  button: { to: string; content: string; external: boolean };
}

const HwWalletElements: IHwWalletElement[] = [
  {
    icon: 'ledger-icon',
    button: {
      to: EXT_URLS.LEDGER_REFERRAL.url,
      content: translateRaw('BUY_HW_ACTION_BUTTON'),
      external: true
    }
  },
  {
    icon: 'trezor-icon',
    button: {
      to: EXT_URLS.TREZOR_REFERRAL.url,
      content: translateRaw('BUY_HW_ACTION_BUTTON'),
      external: true
    }
  }
];

export const actionTemplates: ActionTemplate[] = [
  {
    name: ACTION_NAME.UPDATE_LABEL,
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
    name: ACTION_NAME.MIGRATE_REP,
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
    name: ACTION_NAME.CLAIM_UNI,
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
    name: ACTION_NAME.RENEW_ENS,
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
    name: ACTION_NAME.BUY_HW,
    heading: translateRaw('BUY_HW_ACTION_HEADING'),
    body: [translate('BUY_HW_ACTION_BODY')],
    // get randomly logo and link between trezor and ledger
    ...randomElementFromArray(HwWalletElements),
    filter: (state: StoreContextState) => !state.accounts.some((c) => isHardwareWallet(c.wallet)),
    priority: 30,
    category: ACTION_CATEGORIES.SECURITY
  },
  {
    name: ACTION_NAME.MYC_MEMBERSHIP,
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
    name: ACTION_NAME.ADD_ACCOUNT,
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
    name: ACTION_NAME.BACKUP,
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
    name: ACTION_NAME.FEEDBACK,
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
    name: ACTION_NAME.NEWSLETTER,
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
    name: ACTION_NAME.TELEGRAM,
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
    name: ACTION_NAME.SWAP,
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
    name: ACTION_NAME.TWITTER,
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
