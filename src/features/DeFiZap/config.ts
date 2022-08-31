import { ReactElement } from 'react';

import compoundDaiBreakdown from '@assets/images/defizap/breakdowns/cdaiBreakdown.svg';
import unipoolDaiBreakdown from '@assets/images/defizap/breakdowns/unidaiBreakdown.svg';
import unipoolSethBreakdown from '@assets/images/defizap/breakdowns/unisethBreakdown.svg';
import collateralizationIcn from '@assets/images/defizap/icn-collateralization.svg';
import diversificationIcn from '@assets/images/defizap/icn-diversification.svg';
import innovationIcn from '@assets/images/defizap/icn-innovation.svg';
import inverstingIcn from '@assets/images/defizap/icn-investing.svg';
import liquidityIcn from '@assets/images/defizap/icn-liquidity.svg';
import smartContractIcn from '@assets/images/defizap/icn-smart-contract.svg';
import cdaiMobileIllustration from '@assets/images/defizap/illustrations/cdai-mobile.svg';
import cdaiIllustration from '@assets/images/defizap/illustrations/cdai.svg';
import unidaiMobileIllustration from '@assets/images/defizap/illustrations/unidai-mobile.svg';
import unidaiIllustration from '@assets/images/defizap/illustrations/unidai.svg';
import unisethMobileIllustration from '@assets/images/defizap/illustrations/uniseth-mobile.svg';
import unisethIllustration from '@assets/images/defizap/illustrations/uniseth.svg';
import moderateRisk from '@assets/images/icn-jogging.svg';
import aggressiveRisk from '@assets/images/icn-running.svg';
import conservativeRisk from '@assets/images/icn-walking.svg';
import translate, { translateRaw } from '@translations';

import AvailableZaps from './components/AvailableZaps';
import ProtocolsExplainer from './components/ProtocolsExplainer';
import { BearishIndicator, BullishIndicator, NeutralIndicator } from './components/ZapIndicators';

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
  risk: number;
  platformsUsed: string[];
  illustration: any;
  mobileIllustration: any;
  zapType: IZapType;
  poolTokenUUID: string;
  breakdownImage: any;
  breakdownTooltip: string;
  withdrawTooltip?: ReactElement | string;
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

export interface RiskAndReward {
  icon: any;
  text: string;
}

export const fetchZapRiskObject = (riskLevel: number) => {
  switch (riskLevel) {
    default:
    case 1:
      return { text: translateRaw('ZAP_INDICATOR_CONSERVATIVE'), image: conservativeRisk };
    case 2:
      return { text: translateRaw('ZAP_INDICATOR_MODERATE'), image: moderateRisk };
    case 3:
      return { text: translateRaw('ZAP_INDICATOR_AGGRESSIVE'), image: aggressiveRisk };
  }
};

export const defaultZapId = 'unipoolseth';

export const ZAPS_CONFIG: IZapConfigObject = {
  unipoolseth: {
    title: translateRaw('ZAP_SETH_UNIPOOL_TITLE'),
    name: translateRaw('ZAP_SETH_UNIPOOL_NAME'),
    key: 'unipoolseth',
    contractAddress: '0xd3EBA712988df0F8A7e5073719A40cE4cbF60b33',
    risk: 1,
    description: translateRaw('ZAP_SETH_UNIPOOL_DESCRIPTION'),
    outlook: 'bullish',
    link: 'https://app.uniswap.org/#/pool',
    minimumGasLimit: 1500000,
    platformsUsed: ['uniswap'],
    illustration: unisethIllustration,
    mobileIllustration: unisethMobileIllustration,
    zapType: IZapType.UNIPOOL,
    poolTokenUUID: 'ca27272a-891e-577d-ae75-f8efe4d55231',
    breakdownImage: unipoolSethBreakdown,
    breakdownTooltip: translateRaw('ZAP_UNISWAP_TOOLTIP'),
    positionDetails: () =>
      BullishIndicator({ text: translateRaw('ZAP_POSITION_BULLISH', { $asset: 'ETH' }) }),
    withdrawTooltip: translate('ZAP_WITHDRAW_TOOLTIP')
  },

  unipooldai: {
    title: translateRaw('ZAP_DAI_UNIPOOL_TITLE'),
    name: translateRaw('ZAP_DAI_UNIPOOL_NAME'),
    key: 'unipooldai',
    contractAddress: '0x929A10EfDA7099865dAD8286Aee8715078902d51',
    risk: 2,
    description: translateRaw('ZAP_DAI_UNIPOOL_DESCRIPTION'),
    outlook: 'neutral',
    link: 'https://app.uniswap.org/#/pool',
    minimumGasLimit: 1500000,
    platformsUsed: ['uniswap'],
    illustration: unidaiIllustration,
    mobileIllustration: unidaiMobileIllustration,
    zapType: IZapType.UNIPOOL,
    poolTokenUUID: '2b7a4d65-9c40-5c21-96eb-f7d380a4dc87',
    breakdownImage: unipoolDaiBreakdown,
    breakdownTooltip: translateRaw('ZAP_UNISWAP_TOOLTIP'),
    positionDetails: () =>
      NeutralIndicator({ text: translateRaw('ZAP_POSITION_NEUTRAL', { $asset: 'ETH' }) }),
    withdrawTooltip: translate('ZAP_WITHDRAW_TOOLTIP')
  },

  compounddai: {
    title: translateRaw('ZAP_COMPOUND_DAI_POOL_TITLE'),
    name: translateRaw('ZAP_COMPOUND_DAI_POOL_NAME'),
    key: 'compounddai',
    contractAddress: '0x225078aea64696c6e4fe3960e471ca45aa9bdae4',
    risk: 2,
    description: translateRaw('ZAP_COMPOUND_DAI_POOL_DESCRIPTION'),
    outlook: 'bearish',
    link: 'https://app.compound.finance',
    minimumGasLimit: 1800000,
    platformsUsed: ['compound', 'kyber'],
    illustration: cdaiIllustration,
    mobileIllustration: cdaiMobileIllustration,
    zapType: IZapType.COMPOUND,
    poolTokenUUID: 'a9cc6884-14bd-53b6-abcd-f9b56b60463d',
    breakdownImage: compoundDaiBreakdown,
    breakdownTooltip: translateRaw('ZAP_COMPOUND_TOOLTIP'),
    positionDetails: () =>
      BearishIndicator({ text: translateRaw('ZAP_POSITION_BEARISH', { $asset: 'ETH' }) })
  }
};

export const riskAndReward: RiskAndReward[] = [
  {
    text: translateRaw('RISK_REWARD_SMART_CONTRACT'),
    icon: smartContractIcn
  },
  {
    text: translateRaw('RISK_REWARD_INVESTING'),
    icon: inverstingIcn
  },
  {
    text: translateRaw('RISK_REWARD_COLLATERALIZATION'),
    icon: collateralizationIcn
  },
  {
    text: translateRaw('RISK_REWARD_INNOVATION'),
    icon: innovationIcn
  },
  {
    text: translateRaw('RISK_REWARD_LIQUIDITY'),
    icon: liquidityIcn
  },
  {
    text: translateRaw('RISK_REWARD_DIVERSIFICATION'),
    icon: diversificationIcn
  }
];

export const accordionContent = [
  {
    title: translateRaw('DEFIZAP_QUESTION_ONE'),
    component: translate('DEFIZAP_QUESTION_ONE_ANSWER')
  },
  {
    title: translateRaw('DEFIZAP_QUESTION_TWO'),
    component: translate('DEFIZAP_QUESTION_TWO_ANSWER')
  },
  {
    title: translateRaw('DEFIZAP_QUESTION_THREE'),
    component: ProtocolsExplainer()
  },
  {
    title: translateRaw('DEFIZAP_QUESTION_FOUR'),
    component: AvailableZaps()
  },
  {
    title: translateRaw('DEFIZAP_QUESTION_FIVE'),
    component: translate('DEFIZAP_QUESTION_FIVE_ANSWER')
  },
  {
    title: translateRaw('DEFIZAP_QUESTION_SIX'),
    component: translate('DEFIZAP_QUESTION_SIX_ANSWER')
  },
  {
    title: translateRaw('DEFIZAP_QUESTION_SEVEN'),
    component: translate('DEFIZAP_QUESTION_SEVEN_ANSWER')
  }
];
