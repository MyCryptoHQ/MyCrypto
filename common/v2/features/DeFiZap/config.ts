export interface IZapConfig {
  name: string;
  key: string;
  contractAddress: string;
  description: string;
  outlook: string;
  link: string;
  minimumGasLimit: number;
}

export const ZAPS_CONFIG: IZapConfig[] = [
  {
    name: 'sETH Unipool',
    key: 'unipoolseth',
    contractAddress: '0xd3EBA712988df0F8A7e5073719A40cE4cbF60b33',
    description:
      'Contributes to the synthetic ETH unipool. Swaps 50% of your ETH to sETH then contributes to the sETH Uniswap pool.',
    outlook: 'bullish',
    link: 'https://defizap.com/zaps/unipoolseth',
    minimumGasLimit: 1500000
  },
  {
    name: 'Lender Pool',
    key: 'lender',
    contractAddress: '0xEbD5E23927891FBfDa10487cCC9A1a1a7b9a4210',
    description:
      'Converts 90% to Dai and contributes it to Compound protocol to generate interest. The remaining 10% is used to open a 2x long ETH position on Fulcrum',
    outlook: 'bearish',
    link: 'https://defizap.com/zaps/lender',
    minimumGasLimit: 1500000
  }
];
