import { BigNumber } from 'bignumber.js';

import { TAddress } from 'v2/types/address';
import { DAIUUID, ETHUUID } from 'v2/utils';
import translate, { translateRaw } from 'v2/translations';

import onemonthIcon from 'assets/images/membership/membership-onemonth.svg';
import threemonthsIcon from 'assets/images/membership/membership-threemonths.svg';
import sixMonthsIcon from 'assets/images/membership/membership-sixmonths.svg';
import twelveMonthsIcon from 'assets/images/membership/membership-twelvemonths.svg';
import lifetimeIcon from 'assets/images/membership/membership-lifetime.svg';

export interface IMembershipConfig {
  title: string;
  key: IMembershipId;
  contractAddress: string;
  description: string;
  icon: string;
  price: string;
  discount?: string;
  assetUUID: string;
  durationInDays: number;
  discountNotice: string;
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
  memberships: MembershipExpiry[];
}

export interface MembershipExpiry {
  type: IMembershipId;
  expiry: BigNumber;
}

export enum IMembershipId {
  onemonth = 'onemonth',
  threemonths = 'threemonths',
  sixmonths = 'sixmonths',
  twelvemonths = 'twelvemonths',
  lifetime = 'lifetime'
}

export const MEMBERSHIP_PURCHASE_GAS_LIMIT = 1000000;

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
    discountNotice: ''
  },

  threemonths: {
    title: translateRaw('MEMBERSHIP_MONTH', { $duration: '3' }),
    key: IMembershipId.threemonths,
    contractAddress: '0xfe58C642A3F703e7Dc1060B3eE02ED4619046125',
    description: '',
    icon: threemonthsIcon,
    price: '10.5',
    discount: '10',
    assetUUID: DAIUUID,
    durationInDays: 90,
    discountNotice: translateRaw('MEMBERSHIP_DISCOUNT', { $percentage: '10%' })
  },

  sixmonths: {
    title: translateRaw('MEMBERSHIP_MONTH', { $duration: '6' }),
    key: IMembershipId.sixmonths,
    contractAddress: '0x7a84f1074B5929cBB7bd08Fb450CF9Fb22bf5329',
    description: '',
    icon: sixMonthsIcon,
    price: '18',
    discount: '20',
    assetUUID: DAIUUID,
    durationInDays: 180,
    discountNotice: translateRaw('MEMBERSHIP_DISCOUNT', { $percentage: '20%' })
  },

  twelvemonths: {
    title: translateRaw('MEMBERSHIP_MONTH', { $duration: '12' }),
    key: IMembershipId.twelvemonths,
    contractAddress: '0xee2B7864d8bc731389562F820148e372F57571D8',
    description: '',
    icon: twelveMonthsIcon,
    price: '30',
    discount: '40',
    assetUUID: DAIUUID,
    durationInDays: 366,
    discountNotice: translateRaw('MEMBERSHIP_DISCOUNT', { $percentage: '40%' })
  },

  lifetime: {
    title: translateRaw('MEMBERSHIP_LIFETIME_EMOJI'),
    key: IMembershipId.lifetime,
    contractAddress: '0x098D8b363933D742476DDd594c4A5a5F1a62326a',
    description: '',
    icon: lifetimeIcon,
    price: '5',
    assetUUID: ETHUUID,
    durationInDays: 36500,
    discountNotice: translateRaw('MEMBERSHIP_LIFETIME_DESC')
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

export const getExpiryDate = (selectedMembership: IMembershipId): Date => {
  const today = new Date();
  return new Date(
    today.getTime() + 86400000 * MEMBERSHIP_CONFIG[selectedMembership].durationInDays
  );
};

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
    title: translateRaw('MEMBERSHIP_ACCORDION_FORTH_TITLE'),
    component: translate('MEMBERSHIP_ACCORDION_FORTH_CONTENT')
  }
];
