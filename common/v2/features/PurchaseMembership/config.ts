export enum IZapType {
  UNIPOOL = 'UNIPOOL',
  COMPOUND = 'COMPOUND'
}

export interface IMembershipConfig {
  title: string;
  name: string;
  key: string;
  contractAddress: string;
  description: string;
  positionDetails(): string;
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
    title: 'Everyday ETH Investment',
    name: 'sETH Unipool',
    key: 'unipoolseth',
    contractAddress: '0xd3EBA712988df0F8A7e5073719A40cE4cbF60b33',
    description:
      'Preserve your ETH price exposure and earn a variable interest rate (generally 1-2%) by lending on the Uniswap exchange protocol.',
    positionDetails: () => 'Bullish on ETH'
  },

  threemonths: {
    title: 'Everyday ETH Investment',
    name: 'sETH Unipool',
    key: 'unipoolseth',
    contractAddress: '0xd3EBA712988df0F8A7e5073719A40cE4cbF60b33',
    description:
      'Preserve your ETH price exposure and earn a variable interest rate (generally 1-2%) by lending on the Uniswap exchange protocol.',
    positionDetails: () => 'Bullish on ETH'
  },

  sixmonths: {
    title: 'Everyday ETH Investment',
    name: 'sETH Unipool',
    key: 'unipoolseth',
    contractAddress: '0xd3EBA712988df0F8A7e5073719A40cE4cbF60b33',
    description:
      'Preserve your ETH price exposure and earn a variable interest rate (generally 1-2%) by lending on the Uniswap exchange protocol.',
    positionDetails: () => 'Bullish on ETH'
  },

  lifetime: {
    title: 'Everyday ETH Investment',
    name: 'sETH Unipool',
    key: 'unipoolseth',
    contractAddress: '0xd3EBA712988df0F8A7e5073719A40cE4cbF60b33',
    description:
      'Preserve your ETH price exposure and earn a variable interest rate (generally 1-2%) by lending on the Uniswap exchange protocol.',
    positionDetails: () => 'Bullish on ETH'
  }
};

export const defaultMembershipId = IMembershipId.onemonth;

export const defaultMembershipObject = MEMBERSHIP_CONFIG[defaultMembershipId];
