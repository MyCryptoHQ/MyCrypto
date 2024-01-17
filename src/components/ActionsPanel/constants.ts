import { add, fromUnixTime, isBefore } from 'date-fns';

import { TIcon } from '@components';
import {
  ANTv1UUID,
  DAPPNODE_AIRDROP_LINK,
  ENS_AIRDROP_LINK,
  ETHUUID,
  EXT_URLS,
  FAUCET_NETWORKS,
  GIV_AIRDROP_LINK,
  GOLEMV1UUID,
  LENDUUID,
  REPV1UUID,
  ROUTE_PATHS,
  socialMediaLinks,
  SUBSCRIBE_NEWSLETTER_LINK,
  UNISWAP_LINK
} from '@config';
import translate, { translateRaw } from '@translations';
import {
  ACTION_CATEGORIES,
  ACTION_NAME,
  ActionFilters,
  ActionTemplate,
  ClaimState,
  ClaimType
} from '@types';
import { formatSupportEmail, isHardwareWallet, randomElementFromArray } from '@utils';

import {
  ActionButton,
  ActionButtonProps,
  ClaimSubHead,
  ClaimTable,
  EnsSubHead,
  MigrationSubHead,
  MigrationTable
} from './components';

interface IHwWalletElement {
  icon: TIcon;
  button: {
    component(props: ActionButtonProps): JSX.Element;
    props: Omit<ActionButtonProps, 'userAction'>;
  };
}

const HwWalletElements: IHwWalletElement[] = [
  {
    icon: 'ledger-icon',
    button: {
      component: ActionButton,
      props: {
        to: EXT_URLS.LEDGER_REFERRAL.url,
        content: translateRaw('BUY_HW_ACTION_BUTTON'),
        external: true
      }
    }
  },
  {
    icon: 'trezor-icon',
    button: {
      component: ActionButton,
      props: {
        to: EXT_URLS.TREZOR_REFERRAL.url,
        content: translateRaw('BUY_HW_ACTION_BUTTON'),
        external: true
      }
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
      component: ActionButton,
      props: {
        content: translateRaw('UPDATE_LABEL_ACTION_BUTTON'),
        to: ROUTE_PATHS.SETTINGS.path,
        external: false
      }
    },
    category: ACTION_CATEGORIES.MYC_EXPERIENCE
  },
  {
    name: ACTION_NAME.MIGRATE_REP,
    heading: translateRaw('MIGRATE_REP_ACTION_HEADING'),
    subHeading: MigrationSubHead,
    icon: 'rep-logo',
    body: [translate('MIGRATE_REP_ACTION_BODY')],
    filter: ({ assets }: ActionFilters) => assets.some((a) => a.uuid === REPV1UUID),
    priority: 30,
    Component: MigrationTable,
    props: { assetUuid: REPV1UUID },
    button: {
      component: ActionButton,
      props: {
        content: translateRaw('MIGRATE_REP_ACTION_BUTTON'),
        to: ROUTE_PATHS.TOKEN_MIGRATION.path,
        external: false
      }
    },
    category: ACTION_CATEGORIES.MIGRATION
  },
  {
    name: ACTION_NAME.CLAIM_UNI,
    heading: translateRaw('CLAIM_TOKENS_ACTION_HEADING', { $token: 'UNI' }),
    icon: 'uni-logo',
    subHeading: ClaimSubHead,
    body: [translate('CLAIM_TOKENS_ACTION_BODY', { $token: 'UNI' })],
    filter: ({ claims }: ActionFilters) =>
      claims[ClaimType.UNI]?.some((c) => c.state === ClaimState.UNCLAIMED),
    priority: 30,
    Component: ClaimTable,
    props: {
      type: ClaimType.UNI
    },
    button: {
      component: ActionButton,
      props: {
        content: translateRaw('CLAIM_TOKENS_ACTION_BUTTON'),
        to: UNISWAP_LINK,
        external: true
      }
    },
    category: ACTION_CATEGORIES.THIRD_PARTY
  },
  {
    name: ACTION_NAME.CLAIM_DAPPNODE,
    heading: translateRaw('CLAIM_TOKENS_ACTION_HEADING', { $token: 'NODE' }),
    icon: 'node-logo',
    subHeading: ClaimSubHead,
    body: [translate('CLAIM_TOKENS_ACTION_BODY', { $token: 'NODE' })],
    filter: ({ claims }: ActionFilters) =>
      claims[ClaimType.NODE]?.some((c) => c.state === ClaimState.UNCLAIMED),
    priority: 30,
    Component: ClaimTable,
    props: {
      type: ClaimType.NODE
    },
    button: {
      component: ActionButton,
      props: {
        content: translateRaw('CLAIM_TOKENS_ACTION_BUTTON'),
        to: DAPPNODE_AIRDROP_LINK,
        external: true
      }
    },
    category: ACTION_CATEGORIES.THIRD_PARTY
  },
  {
    name: ACTION_NAME.CLAIM_ENS,
    heading: translateRaw('CLAIM_TOKENS_ACTION_HEADING', { $token: 'ENS' }),
    icon: 'ensLogo',
    subHeading: ClaimSubHead,
    body: [translate('CLAIM_TOKENS_ACTION_BODY', { $token: 'ENS' })],
    filter: ({ claims }: ActionFilters) =>
      claims[ClaimType.ENS]?.some((c) => c.state === ClaimState.UNCLAIMED),
    priority: 30,
    Component: ClaimTable,
    props: {
      type: ClaimType.ENS
    },
    button: {
      component: ActionButton,
      props: {
        content: translateRaw('CLAIM_TOKENS_ACTION_BUTTON'),
        to: ENS_AIRDROP_LINK,
        external: true
      }
    },
    category: ACTION_CATEGORIES.THIRD_PARTY
  },
  {
    name: ACTION_NAME.CLAIM_GIV,
    heading: translateRaw('CLAIM_TOKENS_ACTION_HEADING', { $token: 'GIV' }),
    icon: 'givLogo',
    subHeading: ClaimSubHead,
    body: [translate('CLAIM_TOKENS_ACTION_BODY', { $token: 'GIV' })],
    filter: ({ claims }: ActionFilters) =>
      claims[ClaimType.GIV]?.some((c) => c.state === ClaimState.UNCLAIMED),
    priority: 30,
    Component: ClaimTable,
    props: {
      type: ClaimType.GIV
    },
    button: {
      component: ActionButton,
      props: {
        content: translateRaw('CLAIM_TOKENS_ACTION_BUTTON'),
        to: GIV_AIRDROP_LINK,
        external: true
      }
    },
    category: ACTION_CATEGORIES.THIRD_PARTY
  },
  {
    name: ACTION_NAME.MIGRATE_LEND,
    heading: translateRaw('MIGRATE_LEND_ACTION_HEADING'),
    icon: 'lend-logo',
    subHeading: MigrationSubHead,
    body: [translate('MIGRATE_LEND_ACTION_BODY')],
    filter: ({ assets }: ActionFilters) => assets.some((a) => a.uuid === LENDUUID),
    priority: 10,
    Component: MigrationTable,
    props: { assetUuid: LENDUUID },
    button: {
      component: ActionButton,
      props: {
        content: translateRaw('MIGRATE_REP_ACTION_BUTTON'),
        to: ROUTE_PATHS.TOKEN_MIGRATION.path,
        external: false
      }
    },
    category: ACTION_CATEGORIES.THIRD_PARTY
  },
  {
    name: ACTION_NAME.MIGRATE_ANT,
    heading: translateRaw('MIGRATE_ANT_ACTION_HEADING'),
    subHeading: MigrationSubHead,
    icon: 'ant-logo',
    body: [translate('MIGRATE_ANT_ACTION_BODY')],
    filter: ({ assets }: ActionFilters) => assets.some((a) => a.uuid === ANTv1UUID),
    priority: 30,
    Component: MigrationTable,
    props: { assetUuid: ANTv1UUID },
    button: {
      component: ActionButton,
      props: {
        content: translateRaw('MIGRATE_REP_ACTION_BUTTON'),
        to: ROUTE_PATHS.TOKEN_MIGRATION.path,
        external: false
      }
    },
    category: ACTION_CATEGORIES.MIGRATION
  },
  {
    name: ACTION_NAME.MIGRATE_GOL,
    heading: translateRaw('MIGRATE_GOL_ACTION_HEADING'),
    subHeading: MigrationSubHead,
    icon: 'gol-logo',
    body: [translate('MIGRATE_GOL_ACTION_BODY')],
    filter: ({ assets }: ActionFilters) => assets.some((a) => a.uuid === GOLEMV1UUID),
    priority: 30,
    Component: MigrationTable,
    props: { assetUuid: GOLEMV1UUID },
    button: {
      component: ActionButton,
      props: {
        content: translateRaw('MIGRATE_REP_ACTION_BUTTON'),
        to: ROUTE_PATHS.TOKEN_MIGRATION.path,
        external: false
      }
    },
    category: ACTION_CATEGORIES.MIGRATION
  },
  {
    name: ACTION_NAME.RENEW_ENS,
    heading: translateRaw('RENEW_ENS_ACTION_HEADING'),
    subHeading: EnsSubHead,
    icon: 'ensLogo',
    filter: ({ ensOwnershipRecords }: ActionFilters) =>
      ensOwnershipRecords.some((r) =>
        isBefore(fromUnixTime(parseInt(r.expiryDate, 10)), add(new Date(), { days: 60 }))
      ),
    body: [translate('RENEW_ENS_ACTION_BODY')],
    priority: 30,
    button: {
      component: ActionButton,
      props: {
        content: translateRaw('RENEW_ENS_ACTION_BUTTON'),
        to: ROUTE_PATHS.ENS.path,
        external: false
      }
    },
    category: ACTION_CATEGORIES.THIRD_PARTY
  },
  {
    name: ACTION_NAME.BUY_HW,
    heading: translateRaw('BUY_HW_ACTION_HEADING'),
    body: [translate('BUY_HW_ACTION_BODY')],
    // get randomly logo and link between trezor and ledger
    ...randomElementFromArray(HwWalletElements),
    filter: ({ accounts }: ActionFilters) => !accounts.some((c) => isHardwareWallet(c.wallet)),
    priority: 30,
    category: ACTION_CATEGORIES.SECURITY
  },
  {
    name: ACTION_NAME.ADD_ACCOUNT,
    heading: translateRaw('ADD_ACCOUNT_ACTION_HEADING'),
    icon: 'experience',
    body: [translate('ADD_ACCOUNT_ACTION_BODY')],
    filter: ({ accounts }: ActionFilters) => accounts.length < 3,
    priority: 0,
    button: {
      component: ActionButton,
      props: {
        content: translateRaw('ADD_ACCOUNT_ACTION_BUTTON'),
        to: ROUTE_PATHS.ADD_ACCOUNT.path,
        external: false
      }
    },
    category: ACTION_CATEGORIES.MYC_EXPERIENCE
  },
  {
    name: ACTION_NAME.BACKUP,
    heading: translateRaw('BACKUP_ACTION_HEADING'),
    icon: 'experience',
    body: [translate('BACKUP_ACTION_BODY')],
    filter: ({ accounts }: ActionFilters) => accounts.length >= 3,
    priority: 0,
    button: {
      component: ActionButton,
      props: {
        content: translateRaw('BACKUP_ACTION_BUTTON'),
        to: ROUTE_PATHS.SETTINGS_EXPORT.path,
        external: false
      }
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
      component: ActionButton,
      props: {
        content: translateRaw('FEEDBACK_ACTION_BUTTON'),
        shouldComplete: true,
        to: formatSupportEmail(translateRaw('FEEDBACK_ACTION_MAIL_SUBJECT')),
        external: true
      }
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
      component: ActionButton,
      props: {
        content: translateRaw('NEWSLETTER_ACTION_BUTTON'),
        shouldComplete: true,
        to: SUBSCRIBE_NEWSLETTER_LINK,
        external: true
      }
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
      component: ActionButton,
      props: {
        content: translateRaw('TELEGRAM_ACTION_BUTTON'),
        shouldComplete: true,
        to: socialMediaLinks.find((i) => i.text === 'telegram')!.link,
        external: true
      }
    },
    category: ACTION_CATEGORIES.OTHER
  },
  {
    name: ACTION_NAME.SWAP,
    heading: translateRaw('SWAP_ACTION_HEADING'),
    icon: 'swap',
    body: [translate('SWAP_ACTION_BODY')],
    filter: ({ assets }: ActionFilters) =>
      assets.some((a) => a.uuid === ETHUUID) && assets.some((a) => a.uuid !== ETHUUID),
    priority: 0,
    button: {
      component: ActionButton,
      props: {
        content: translateRaw('SWAP_ACTION_BUTTON'),
        shouldComplete: true,
        to: ROUTE_PATHS.SWAP.path,
        external: false
      }
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
      component: ActionButton,
      props: {
        content: translateRaw('TWITTER_ACTION_BUTTON'),
        shouldComplete: true,
        to: socialMediaLinks.find((i) => i.text === 'twitter')!.link,
        external: true
      }
    },
    category: ACTION_CATEGORIES.OTHER
  },
  {
    name: ACTION_NAME.TESTNET_FAUCET,
    heading: translateRaw('FAUCET_ACTION_HEADING'),
    icon: 'faucet-icon',
    body: [translate('FAUCET_ACTION_BODY')],
    filter: ({ accounts }: ActionFilters) =>
      accounts.some(
        (a) =>
          Object.values(FAUCET_NETWORKS).includes(a.networkId) &&
          a.assets.some((asset) => asset.type === 'base' && asset.balance.lt(1))
      ),
    priority: 0,
    props: { assetUuid: REPV1UUID },
    button: {
      component: ActionButton,
      props: {
        content: translateRaw('FAUCET_ACTION_BUTTON'),
        to: ROUTE_PATHS.FAUCET.path,
        external: false
      }
    },
    category: ACTION_CATEGORIES.THIRD_PARTY
  }
];
