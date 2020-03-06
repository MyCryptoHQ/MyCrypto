import { BearishIndicator, BullishIndicator } from './components';

import moderateRisk from 'assets/images/defizap/moderateRisk.svg';
import conservativeRisk from 'assets/images/defizap/conservativeRisk.svg';
import aggressiveRisk from 'assets/images/defizap/aggressiveRisk.svg';

export enum IZapType {
  UNIPOOL = 'UNIPOOL',
  COMPOUND = 'COMPOUND'
}

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
  zapType: IZapType;
  interestTokenAddr: string;
  poolTokenUUID: string;
  positionDetails(): JSX.Element;
}

export type IZapConfigObject = {
  [key in IZapId]: IZapConfig;
};

export enum IZapId {
  unipoolseth = 'unipoolseth',
  unipooldai = 'unipooldai',
  lender = 'lender'
}

export const fetchZapRiskObject = (riskLevel: number) => {
  switch (riskLevel) {
    default:
    case 1:
      return { text: 'Conservative', image: conservativeRisk };
    case 2:
      return { text: 'Moderate', image: moderateRisk };
    case 3:
      return { text: 'Aggressive', image: aggressiveRisk };
  }
};

export const defaultZapId = 'unipoolseth';

export const ZAPS_CONFIG: IZapConfigObject = {
  unipoolseth: {
    title: 'Everyday ETH Investment',
    name: 'sETH Unipool',
    key: 'unipoolseth',
    contractAddress: '0xd3EBA712988df0F8A7e5073719A40cE4cbF60b33',
    risk: 1,
    description:
      'Contributes 100% to the synthetic ETH unipool. Swaps 50% of your ETH to sETH then contributes to the sETH Uniswap pool.',
    outlook: 'bullish',
    link: 'https://defizap.com/zaps/unipoolseth',
    ctaText: 'Make money with Uniswap',
    minimumGasLimit: 1500000,
    platformsUsed: ['uniswap'],
    bulletPoints: [
      'Retain 100% ETH Exposure.',
      'Grows your stack by market making on the of the fees from the ETH/DAI trading pair on Uniswap.',
      'Eliminate impermanent loss when ETH goes up but increases it on the way down.'
    ],
    zapType: IZapType.UNIPOOL,
    poolTokenUUID: 'ca27272a-891e-577d-ae75-f8efe4d55231',
    interestTokenAddr: '0xe9Cf7887b93150D4F2Da7dFc6D502B216438F244',
    positionDetails: () => BullishIndicator({ text: 'Bullish on ETH' })
  },

  unipooldai: {
    title: 'Income-producing Investment',
    name: 'DAI Unipool',
    key: 'unipooldai',
    contractAddress: '0x929A10EfDA7099865dAD8286Aee8715078902d51',
    risk: 2,
    description:
      'Converts 50% of your ETH to DAI and contributes both to a Uniswap pool to grow your funds.',
    outlook: 'bearish',
    link: 'https://defizap.com/zaps/llpdai',
    ctaText: 'Make money & bet against ETH',
    minimumGasLimit: 1500000,
    platformsUsed: ['uniswap'],
    bulletPoints: [
      'Reduce your exposure to changes in the price of ETH.',
      'Act as a market maker to generate income by providing liquditiy to the DAI/ETH pool on Uniswap.'
    ],
    zapType: IZapType.UNIPOOL,
    poolTokenUUID: '2b7a4d65-9c40-5c21-96eb-f7d380a4dc87',
    interestTokenAddr: '0x2a1530C4C41db0B0b2bB646CB5Eb1A67b7158667',
    positionDetails: () => BearishIndicator({ text: 'Bearish on ETH' })
  },
  lender: {
    title: 'ETH Bearish Investment',
    name: 'Compound Lender Pool',
    key: 'compoundLender',
    contractAddress: '0xEbD5E23927891FBfDa10487cCC9A1a1a7b9a4210',
    risk: 3,
    description:
      'Converts all of your ETH to DAI and contributes it to the Compound Money Market protocol to grow your funds.',
    outlook: 'bearish',
    link: 'https://defizap.com/zaps/lender',
    ctaText: 'Make money and bet against ETH',
    minimumGasLimit: 7000000,
    platformsUsed: ['compound', 'kyber'],
    bulletPoints: [
      'Remove your exposure to changes in the price of ETH.',
      'Contribute your DAI to a money market protocol to generate a return of up to 8% per year.'
    ],
    zapType: IZapType.COMPOUND,
    poolTokenUUID: '350c0d6f-a0eb-504e-9a8c-43a4d5966fc3', // <- This is cSAI for testing purposes. // cDAI is: 'a9cc6884-14bd-53b6-abcd-f9b56b60463d',
    interestTokenAddr: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
    positionDetails: () => BearishIndicator({ text: 'Bearish on ETH' })
  }
};
