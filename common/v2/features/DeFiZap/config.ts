export interface IZapConfig {
  name: string;
  key: string;
  contractAddress: string;
  description: string;
  outlook: string;
  link: string;
  minimumGasLimit: number;
  ctaText: string;
  risk: number;
}

export interface IZapConfigObject {
  [key: string]: IZapConfig;
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
    name: 'sETH Unipool',
    key: 'unipoolseth',
    contractAddress: '0xd3EBA712988df0F8A7e5073719A40cE4cbF60b33',
    risk: 1,
    description:
      'Contributes to the synthetic ETH unipool. Swaps 50% of your ETH to sETH then contributes to the sETH Uniswap pool.',
    outlook: 'bullish',
    link: 'https://defizap.com/zaps/unipoolseth',
    ctaText: 'Make money with Uniswap',
    minimumGasLimit: 1500000
  },
  lender: {
    name: 'Lender Pool',
    key: 'lender',
    contractAddress: '0xEbD5E23927891FBfDa10487cCC9A1a1a7b9a4210',
    risk: 5,
    description:
      'Converts 90% to Dai and contributes it to Compound protocol to generate interest. The remaining 10% is used to open a 2x long ETH position on Fulcrum',
    outlook: 'bearish',
    link: 'https://defizap.com/zaps/lender',
    ctaText: 'Make money and bet against ETH',
    minimumGasLimit: 7000000
  }
};
