import step2SVG from '@assets/images/icn-receive.svg';
import step1SVG from '@assets/images/icn-send.svg';
import lifetimeIcon from '@assets/images/membership/membership-lifetime.svg';
import onemonthIcon from '@assets/images/membership/membership-onemonth.svg';
import sixMonthsIcon from '@assets/images/membership/membership-sixmonths.svg';
import threemonthsIcon from '@assets/images/membership/membership-threemonths.svg';
import twelveMonthsIcon from '@assets/images/membership/membership-twelvemonths.svg';
import { DAIUUID, DEFAULT_NETWORK, ETHUUID, XDAI_NETWORK, XDAIUUID } from '@config';
import translate, { translateRaw } from '@translations';
import { NetworkId, TAddress } from '@types';

export interface IMembershipConfig {
  title: string;
  key: IMembershipId;
  contractAddress: string;
  description: string;
  icon: string;
  price: string;
  networkId: NetworkId;
  discount?: string;
  assetUUID: string;
  durationInDays: number;
  discountNotice: string;
  disabled?: boolean;
}

export type IMembershipConfigObject = {
  [key in IMembershipId]: IMembershipConfig;
};

export enum MembershipState {
  MEMBER,
  NOTMEMBER,
  EXPIRED,
  ERROR
}

export interface MembershipStatus {
  address: TAddress;
  networkId: NetworkId;
  memberships: MembershipExpiry[];
}

export interface MembershipExpiry {
  type: IMembershipId;
  expiry: string;
}

export enum IMembershipId {
  onemonth = 'onemonth',
  threemonths = 'threemonths',
  sixmonths = 'sixmonths',
  twelvemonths = 'twelvemonths',
  lifetime = 'lifetime',
  xdaionemonth = 'xdaionemonth',
  xdaitwelvemonths = 'xdaitwelvemonths',
  xdailifetime = 'xdailifetime'
}

export const MEMBERSHIP_PURCHASE_GAS_LIMIT = 1000000;

// Also update eth contracts when updating membership contract addresses
export const MEMBERSHIP_CONFIG: IMembershipConfigObject = {
  onemonth: {
    title: translateRaw('MEMBERSHIP_MONTH', { $duration: '1' }),
    key: IMembershipId.onemonth,
    contractAddress: '0x6cA105D2AF7095B1BCEeb6A2113D168ddDCD57cf',
    description: '',
    icon: onemonthIcon,
    price: '4',
    assetUUID: DAIUUID,
    durationInDays: 30,
    discountNotice: '',
    networkId: DEFAULT_NETWORK
  },

  xdaionemonth: {
    title: translateRaw('MEMBERSHIP_MONTH', { $duration: '1' }),
    key: IMembershipId.xdaionemonth,
    contractAddress: '0xcB3BB4CCe15b492E7fdD7cb9a3835C034714207A',
    description: '',
    icon: onemonthIcon,
    price: '4',
    assetUUID: XDAIUUID,
    durationInDays: 30,
    discountNotice: '',
    networkId: XDAI_NETWORK
  },

  threemonths: {
    title: translateRaw('MEMBERSHIP_MONTHS', { $duration: '3' }),
    key: IMembershipId.threemonths,
    contractAddress: '0xfe58C642A3F703e7Dc1060B3eE02ED4619046125',
    description: '',
    icon: threemonthsIcon,
    price: '10.5',
    discount: '10',
    disabled: true,
    assetUUID: DAIUUID,
    durationInDays: 90,
    discountNotice: translateRaw('MEMBERSHIP_DISCOUNT', { $percentage: '~12.5%' }),
    networkId: DEFAULT_NETWORK
  },

  sixmonths: {
    title: translateRaw('MEMBERSHIP_MONTHS', { $duration: '6' }),
    key: IMembershipId.sixmonths,
    contractAddress: '0x7a84f1074B5929cBB7bd08Fb450CF9Fb22bf5329',
    description: '',
    icon: sixMonthsIcon,
    price: '18',
    discount: '20',
    disabled: true,
    assetUUID: DAIUUID,
    durationInDays: 180,
    discountNotice: translateRaw('MEMBERSHIP_DISCOUNT', { $percentage: '~25%' }),
    networkId: DEFAULT_NETWORK
  },

  twelvemonths: {
    title: translateRaw('MEMBERSHIP_MONTHS', { $duration: '12' }),
    key: IMembershipId.twelvemonths,
    contractAddress: '0xee2B7864d8bc731389562F820148e372F57571D8',
    description: '',
    icon: twelveMonthsIcon,
    price: '30',
    discount: '40',
    assetUUID: DAIUUID,
    durationInDays: 366,
    discountNotice: translateRaw('MEMBERSHIP_DISCOUNT', { $percentage: '~37.5%' }),
    networkId: DEFAULT_NETWORK
  },

  xdaitwelvemonths: {
    title: translateRaw('MEMBERSHIP_MONTHS', { $duration: '12' }),
    key: IMembershipId.xdaitwelvemonths,
    contractAddress: '0xf97f516Cc0700a4Ce9Ee64D488F744f631e1525d',
    description: '',
    icon: twelveMonthsIcon,
    price: '30',
    discount: '40',
    assetUUID: XDAIUUID,
    durationInDays: 366,
    discountNotice: translateRaw('MEMBERSHIP_DISCOUNT', { $percentage: '~37.5%' }),
    networkId: XDAI_NETWORK
  },

  lifetime: {
    title: translateRaw('MEMBERSHIP_LIFETIME_EMOJI'),
    key: IMembershipId.lifetime,
    contractAddress: '0x098D8b363933D742476DDd594c4A5a5F1a62326a',
    description: '',
    icon: lifetimeIcon,
    price: '2',
    assetUUID: ETHUUID,
    durationInDays: 36500,
    discountNotice: translateRaw('MEMBERSHIP_LIFETIME_DESC'),
    networkId: DEFAULT_NETWORK
  },

  xdailifetime: {
    title: translateRaw('MEMBERSHIP_LIFETIME_EMOJI'),
    key: IMembershipId.xdailifetime,
    contractAddress: '0xEB24302c4c78963e1b348b274aa9cC6fcbe80527',
    description: '',
    icon: lifetimeIcon,
    price: '999',
    assetUUID: XDAIUUID,
    durationInDays: 36500,
    discountNotice: translateRaw('MEMBERSHIP_LIFETIME_DESC'),
    networkId: XDAI_NETWORK
  }
};

export const defaultMembershipId = IMembershipId.onemonth;

export const defaultMembershipObject = MEMBERSHIP_CONFIG[defaultMembershipId];

export const MEMBERSHIP_CONTRACTS = Object.fromEntries(
  Object.keys(MEMBERSHIP_CONFIG).map((key) => [
    MEMBERSHIP_CONFIG[key as IMembershipId].contractAddress,
    key as IMembershipId
  ])
);

export const stepsContent = [
  {
    title: translateRaw('APPROVE_MEMBERSHIP'),
    icon: step1SVG,
    content: translateRaw('MEMBERSHIP_STEP1_TEXT'),
    buttonText: `${translateRaw('APPROVE_MEMBERSHIP')}`
  },
  {
    title: translateRaw('COMPLETE_PURCHASE'),
    icon: step2SVG,
    content: translateRaw('MEMBERSHIP_STEP2_TEXT'),
    buttonText: `${translateRaw('CONFIRM_TRANSACTION')}`
  }
];

export const accordionContent = [
  {
    title: translateRaw('MEMBERSHIP_ACCORDION_FIRST_TITLE'),
    component: translate('MEMBERSHIP_ACCORDION_FIRST_CONTENT')
  },
  {
    title: translateRaw('MEMBERSHIP_ACCORDION_SECOND_TITLE'),
    component: translate('MEMBERSHIP_ACCORDION_SECOND_CONTENT')
  },
  {
    title: translateRaw('MEMBERSHIP_ACCORDION_THIRD_TITLE'),
    component: translate('MEMBERSHIP_ACCORDION_THIRD_CONTENT')
  },
  {
    title: translateRaw('MEMBERSHIP_ACCORDION_FIFTH_TITLE'),
    component: translate('MEMBERSHIP_ACCORDION_FIFTH_CONTENT')
  },
  {
    title: translateRaw('MEMBERSHIP_ACCORDION_FOURTH_TITLE'),
    component: translate('MEMBERSHIP_ACCORDION_FOURTH_CONTENT')
  }
];
