import { TAddress } from 'v2/types/address';
import { DAIUUID, EtherUUID } from 'v2/utils';

import onemonthIcon from 'assets/images/membership/membership-onemonth.svg';
import threemonthsIcon from 'assets/images/membership/membership-threemonths.svg';
import sixMonthsIcon from 'assets/images/membership/membership-sixmonths.svg';
import twelveMonthsIcon from 'assets/images/membership/membership-twelvemonths.svg';
import lifetimeIcon from 'assets/images/membership/membership-lifetime.svg';

export interface IMembershipConfig {
  title: string;
  name: string;
  key: IMembershipId;
  contractAddress: string;
  description: string;
  icon: string;
  price: string;
  assetUUID: string;
  durationInDays: number;
}

export type IMembershipConfigObject = {
  [key in IMembershipId]: IMembershipConfig;
};

export enum MembershipState {
  MEMBER,
  NOTMEMBER,
  ERROR
}

export interface MembershipStatus {
  address: TAddress;
  memberships: IMembershipId[];
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
    title: 'One Month Membership',
    name: 'One Month Membership',
    key: IMembershipId.onemonth,
    contractAddress: '0xCE8EF07495A36c451fB49b7391b33884832Bb66f',
    description: '',
    icon: onemonthIcon,
    price: '4',
    assetUUID: DAIUUID,
    durationInDays: 30
  },

  threemonths: {
    title: 'Three Month Membership',
    name: 'Three Month Membership',
    key: IMembershipId.threemonths,
    contractAddress: '0xae90e0F7F3f2191B17b1816dFA8C5Ce8e049DC96',
    description: '',
    icon: threemonthsIcon,
    price: '10.5',
    assetUUID: DAIUUID,
    durationInDays: 90
  },

  sixmonths: {
    title: 'Six Month Membership',
    name: 'Six Month Membership',
    key: IMembershipId.sixmonths,
    contractAddress: '0x1C8369C9772E71E82679c9750E4770F29FECcbdD',
    description: '',
    icon: sixMonthsIcon,
    price: '18',
    assetUUID: DAIUUID,
    durationInDays: 180
  },

  twelvemonths: {
    title: 'Twelve Month Membership',
    name: 'Twelve Month Membership',
    key: IMembershipId.twelvemonths,
    contractAddress: '0xb9cae1F4480bcc6dF52F045077BAc1DE448D5406',
    description: '',
    icon: twelveMonthsIcon,
    price: '30',
    assetUUID: DAIUUID,
    durationInDays: 366
  },

  lifetime: {
    title: 'Lifetime Membership',
    name: 'Lifetime Membership',
    key: IMembershipId.lifetime,
    contractAddress: '0x60B8C6c7d339Aa170bcFa5a76053ff3e8c1189c1',
    description: '',
    icon: lifetimeIcon,
    price: '5',
    assetUUID: EtherUUID,
    durationInDays: 36500
  }
};

export const defaultMembershipId = IMembershipId.onemonth;

export const defaultMembershipObject = MEMBERSHIP_CONFIG[defaultMembershipId];

export const MEMBERSHIP_CONTRACTS = Object.fromEntries(
  Object.keys(MEMBERSHIP_CONFIG).map(key => [
    MEMBERSHIP_CONFIG[key as IMembershipId].contractAddress,
    key
  ])
);

export const getExpiryDate = (selectedMembership: IMembershipId): Date => {
  const today = new Date();
  return new Date(
    today.getTime() + 86400000 * MEMBERSHIP_CONFIG[selectedMembership].durationInDays
  );
};
