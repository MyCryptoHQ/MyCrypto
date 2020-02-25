export interface IZapConfig {
  title: string;
  name: string;
  key: string;
  contractAddress: string;
  description: string;
  outlook: string;
  link: string;
  minimumGasLimit: number;
  ctaText: string;
  risk: number;
  platformsUsed: string[];
  bulletPoints: string[];
  positionDetails: string;
}

export type IZapConfigObject = {
  [key in IZapId]: IZapConfig;
};

export enum IZapId {
  unipoolseth = 'unipoolseth',
  llpdai = 'llpdai',
  lender = 'lender'
}

export const fetchRiskText = (riskLevel: number) => {
  switch (riskLevel) {
    case 1:
      return 'Conservative';
    case 2:
      return 'Moderate';
    case 3:
      return 'Aggressive';
    case 4:
      return 'Insane';
    case 5:
      return 'Ludicrous';
  }
};

export const ZAPS_CONFIG: IZapConfigObject = {
  unipoolseth: {
    title: 'Everyday ETH Investment',
    name: 'sETH Unipool',
    key: 'unipoolseth',
    contractAddress: '0xd3EBA712988df0F8A7e5073719A40cE4cbF60b33',
    risk: 2,
    description:
      'Contributes 100% to the synthetic ETH unipool. Swaps 50% of your ETH to sETH then contributes to the sETH Uniswap pool.',
    outlook: 'bullish',
    link: 'https://defizap.com/zaps/unipoolseth',
    ctaText: 'Make money with Uniswap',
    minimumGasLimit: 1500000,
    platformsUsed: ['uniswap'],
    bulletPoints: [
      'Retain 100% ETH Exposure.',
      'Generate 66% of the fees from the ETH/DAI trading pair on Uniswap.',
      'Eliminate impermanent loss when ETH goes up but increases it on the way down.'
    ],
    positionDetails: 'Bullish on ETH'
  },
  lender: {
    title: 'ETH Bearish Investment',
    name: 'Lender Pool',
    key: 'lender',
    contractAddress: '0xEbD5E23927891FBfDa10487cCC9A1a1a7b9a4210',
    risk: 4,
    description:
      'Converts 90% of your ETH to DAI and contributes it to Compound protocol to grow your funds. The remaining 10% is used to open a 2x long ETH position on Fulcrum',
    outlook: 'bearish',
    link: 'https://defizap.com/zaps/lender',
    ctaText: 'Make money and bet against ETH',
    minimumGasLimit: 7000000,
    platformsUsed: ['compound', 'fulcrum', 'kyber'],
    bulletPoints: [
      'Retain 100% ETH Exposure.',
      'Generate 66% of the fees from the ETH/DAI trading pair on Uniswap.',
      'Eliminate impermanent loss when ETH goes up but increases it on the way down.'
    ],
    positionDetails: 'Bearish on ETH'
  },
  llpdai: {
    title: 'MoonShot Investment',
    name: 'DAI Investor',
    key: 'llpdai',
    contractAddress: '0x8dfcB49766c0296E4373A0300b52C3637614Db59',
    risk: 5,
    description:
      'Converts 67% of your ETH to DAI and contributes it to the Uniswap protocol to grow your funds. The remaining 33% is used to open a 2x long ETH position on Fulcrum',
    outlook: 'bullish',
    link: 'https://defizap.com/zaps/llpdai',
    ctaText: 'Make money and bet on ETH',
    minimumGasLimit: 5000000,
    platformsUsed: ['uniswap', 'fulcrum', 'kyber'],
    bulletPoints: [
      'Retain 100% ETH Exposure.',
      'Generate 66% of the fees from the ETH/DAI trading pair on Uniswap.',
      'Eliminate impermanent loss when ETH goes up but increases it on the way down.'
    ],
    positionDetails: 'Bullish on ETH'
  }
};
