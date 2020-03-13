export interface IMembershipConfig {
  title: string;
  name: string;
  key: string;
  contractAddress: string;
  description: string;
}

export type IMembershipConfigObject = {
  [key in IMembershipId]: IMembershipConfig;
};

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
    contractAddress: '',
    description: ''
  },

  threemonths: {
    title: 'Three Month Membership',
    name: 'Three Month Membership',
    key: 'threemonths',
    contractAddress: '',
    description: ''
  },

  sixmonths: {
    title: 'Six Month Membership',
    name: 'Six Month Membership',
    key: 'sixmonths',
    contractAddress: '',
    description: ''
  },

  lifetime: {
    title: 'Lifetime Membership',
    name: 'Lifetime Membership',
    key: 'lifetime',
    contractAddress: '',
    description: ''
  }
};

export const defaultMembershipId = IMembershipId.onemonth;

export const defaultMembershipObject = MEMBERSHIP_CONFIG[defaultMembershipId];
