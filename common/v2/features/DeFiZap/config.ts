import { BearishIndicator, BullishIndicator } from './components';

import moderateRisk from 'assets/images/defizap/moderateRisk.svg';
import conservativeRisk from 'assets/images/defizap/conservativeRisk.svg';
import aggressiveRisk from 'assets/images/defizap/aggressiveRisk.svg';
import unipoolBreakdown from 'assets/images/defizap/breakdowns/unipoolBreakdown.svg';
import compoundBreakdown from 'assets/images/defizap/breakdowns/compoundBreakdown.svg';

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
  breakdownImage: any;
  breakdownTooltip: string;
  positionDetails(): JSX.Element;
}

export type IZapConfigObject = {
  [key in IZapId]: IZapConfig;
};

export enum IZapId {
  unipoolseth = 'unipoolseth',
  unipooldai = 'unipooldai',
  compounddai = 'compounddai'
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
      'Preserves your ETH price exposure and allows you to generate a variable interest rate (generally 1-2%) by market making on Uniswap.',
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
    breakdownImage: unipoolBreakdown,
    breakdownTooltip: 'This zap stores funds in the Uniswap exchange protocol',
    positionDetails: () => BullishIndicator({ text: 'Bullish on ETH' })
  },

  unipooldai: {
    title: 'Income-producing ETH Hedge',
    name: 'DAI Unipool',
    key: 'unipooldai',
    contractAddress: '0x929A10EfDA7099865dAD8286Aee8715078902d51',
    risk: 2,
    description:
      'Hedges against ETH price volatility and allows you to generate a variable interest rate (generally 5-25%) by market making on Uniswap.',
    outlook: 'bearish',
    link: 'https://defizap.com/zaps/unipooldai',
    ctaText: 'Make money & hedge against ETH',
    minimumGasLimit: 1500000,
    platformsUsed: ['uniswap'],
    bulletPoints: [
      'Reduce your exposure to changes in the price of ETH.',
      'Act as a market maker to generate income by providing liquditiy to the DAI/ETH pool on Uniswap.'
    ],
    zapType: IZapType.UNIPOOL,
    poolTokenUUID: '2b7a4d65-9c40-5c21-96eb-f7d380a4dc87',
    interestTokenAddr: '0x2a1530C4C41db0B0b2bB646CB5Eb1A67b7158667',
    breakdownImage: unipoolBreakdown,
    breakdownTooltip: 'This zap stores funds in the Uniswap exchange protocol',
    positionDetails: () => BearishIndicator({ text: 'Bearish on ETH' })
  },
  compounddai: {
    title: 'ETH Bearish Investment',
    name: 'Compound DAI Pool',
    key: 'compounddai',
    contractAddress: '0x225078aea64696c6e4fe3960e471ca45aa9bdae4',
    risk: 3,
    description:
      'Swap ETH for DAI and contribute it to the Compound money market protocol to grow your funds rate of up to 8%.',
    outlook: 'bearish',
    link: 'https://app.compound.finance',
    ctaText: 'Make money with Compound Protocol',
    minimumGasLimit: 1800000,
    platformsUsed: ['compound', 'kyber'],
    bulletPoints: [
      'Remove your exposure to changes in the price of ETH.',
      'Contribute your DAI to a money market protocol to generate a return of up to 8% per year.'
    ],
    zapType: IZapType.COMPOUND,
    poolTokenUUID: 'a9cc6884-14bd-53b6-abcd-f9b56b60463d',
    interestTokenAddr: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
    breakdownImage: compoundBreakdown,
    breakdownTooltip: 'This zap stores funds in the Compound money market protocol',
    positionDetails: () => BearishIndicator({ text: 'Bearish on ETH' })
  }
};
