export interface IMembershipConfig {
  title: string;
  name: string;
  key: string;
  contractAddress: string;
  description: string;
  icon: string;
}

export type IMembershipConfigObject = {
  [key in IMembershipId]: IMembershipConfig;
};

export interface MembershipDict {
  [address: string]: IMembershipId[];
}

export enum IMembershipId {
  onemonth = 'onemonth',
  threemonths = 'threemonths',
  sixmonths = 'sixmonths',
  lifetime = 'lifetime'
}

export const MEMBERSHIP_PURCHASE_GAS_LIMIT = 1000000;

export const MEMBERSHIP_CONFIG: IMembershipConfigObject = {
  onemonth: {
    title: 'One Month Membership',
    name: 'One Month Membership',
    key: 'One Month Membership',
    contractAddress: '0x74970E3CF71E0dB7ca589218853C4b4182081c8a', // TODO: Update this to use the proper ones
    description: '',
    icon: ''
  },

  threemonths: {
    title: 'Three Month Membership',
    name: 'Three Month Membership',
    key: 'threemonths',
    contractAddress: '0x74970E3CF71E0dB7ca589218853C4b4182081c8a', // TODO: Update this to use the proper ones
    description: '',
    icon: ''
  },

  sixmonths: {
    title: 'Six Month Membership',
    name: 'Six Month Membership',
    key: 'sixmonths',
    contractAddress: '0x74970E3CF71E0dB7ca589218853C4b4182081c8a', // TODO: Update this to use the proper ones
    description: '',
    icon: ''
  },

  lifetime: {
    title: 'Lifetime Membership',
    name: 'Lifetime Membership',
    key: 'lifetime',
    contractAddress: '0x74970E3CF71E0dB7ca589218853C4b4182081c8a', // TODO: Update this to use the proper ones
    description: '',
    icon: ''
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
