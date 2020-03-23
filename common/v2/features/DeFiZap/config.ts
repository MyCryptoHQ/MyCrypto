import { TranslateMarkdown } from 'v2/components/TranslateMarkdown';
import { translateRaw } from 'v2/translations';

import { BearishIndicator, BullishIndicator, NeutralIndicator } from './components';
import ProtocolsExplainer from './components/ProtocolsExplainer';
import AvailableZaps from './components/AvailableZaps';

import moderateRisk from 'assets/images/defizap/moderateRisk.svg';
import conservativeRisk from 'assets/images/defizap/conservativeRisk.svg';
import aggressiveRisk from 'assets/images/defizap/aggressiveRisk.svg';
import unipoolSethBreakdown from 'assets/images/defizap/breakdowns/unisethBreakdown.svg';
import unipoolDaiBreakdown from 'assets/images/defizap/breakdowns/unidaiBreakdown.svg';
import compoundDaiBreakdown from 'assets/images/defizap/breakdowns/cdaiBreakdown.svg';
import smartContractIcn from 'assets/images/defizap/icn-smart-contract.svg';
import inverstingIcn from 'assets/images/defizap/icn-investing.svg';
import collateralizationIcn from 'assets/images/defizap/icn-collateralization.svg';
import liquidityIcn from 'assets/images/defizap/icn-liquidity.svg';
import innovationIcn from 'assets/images/defizap/icn-innovation.svg';
import diversificationIcn from 'assets/images/defizap/icn-diversification.svg';
import unisethIllustration from 'assets/images/defizap/illustrations/uniseth.svg';
import unidaiIllustration from 'assets/images/defizap/illustrations/unidai.svg';
import cdaiIllustration from 'assets/images/defizap/illustrations/cdai.svg';

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
  bulletPoints: string[];
  illustration: any;
  zapType: IZapType;
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
    link: 'https://defizap.com/zaps/unipoolseth',
    minimumGasLimit: 1500000,
    platformsUsed: ['uniswap'],
    bulletPoints: [
      translateRaw('ZAP_SETH_UNIPOOL_BULLETPOINT_ONE'),
      translateRaw('ZAP_SETH_UNIPOOL_BULLETPOINT_TWO')
    ],
    illustration: unisethIllustration,
    zapType: IZapType.UNIPOOL,
    poolTokenUUID: 'ca27272a-891e-577d-ae75-f8efe4d55231',
    breakdownImage: unipoolSethBreakdown,
    breakdownTooltip: translateRaw('ZAP_UNISWAP_TOOLTIP'),
    positionDetails: () =>
      BullishIndicator({ text: translateRaw('ZAP_POSITION_BULLISH', { $asset: 'ETH' }) })
  },

  unipooldai: {
    title: translateRaw('ZAP_DAI_UNIPOOL_TITLE'),
    name: translateRaw('ZAP_DAI_UNIPOOL_NAME'),
    key: 'unipooldai',
    contractAddress: '0x929A10EfDA7099865dAD8286Aee8715078902d51',
    risk: 1,
    description: translateRaw('ZAP_DAI_UNIPOOL_DESCRIPTION'),
    outlook: 'neutral',
    link: 'https://defizap.com/zaps/unipooldai',
    minimumGasLimit: 1500000,
    platformsUsed: ['uniswap'],
    bulletPoints: [
      translateRaw('ZAP_DAI_UNIPOOL_BULLETPOINT_ONE'),
      translateRaw('ZAP_DAI_UNIPOOL_BULLETPOINT_TWO')
    ],
    illustration: unidaiIllustration,
    zapType: IZapType.UNIPOOL,
    poolTokenUUID: '2b7a4d65-9c40-5c21-96eb-f7d380a4dc87',
    breakdownImage: unipoolDaiBreakdown,
    breakdownTooltip: translateRaw('ZAP_UNISWAP_TOOLTIP'),
    positionDetails: () =>
      NeutralIndicator({ text: translateRaw('ZAP_POSITION_NEUTRAL', { $asset: 'ETH' }) })
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
    bulletPoints: [
      translateRaw('ZAP_COMPOUND_DAI_POOL_BULLETPOINT_ONE'),
      translateRaw('ZAP_COMPOUND_DAI_POOL_BULLETPOINT_TWO')
    ],
    illustration: cdaiIllustration,
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
    text:
      '**Smart Contract:** There is a chance that smart contracts get hacked and you lose all your money.',
    icon: smartContractIcn
  },
  {
    text: '**Investing:** Put your ETH to work for you with potential to watch your money grow.',
    icon: inverstingIcn
  },
  {
    text:
      '**Collateralization:** If the crypto price swings, you don’t get liquidated nor does the entire system collapse.',
    icon: collateralizationIcn
  },
  {
    text:
      '**Innovation:** Take advantage of innovative decentralized tools avaiable to ETH holders.',
    icon: innovationIcn
  },
  {
    text: '**Liquidity:** Markets are less efficient when they are more shallow.',
    icon: liquidityIcn
  },
  {
    text: '**Diversification:** Expand your investment portfolio leveraging your ETH.',
    icon: diversificationIcn
  }
];

export const accordionContent = [
  {
    title: 'What is DeFi?',
    component: TranslateMarkdown({
      source:
        'Short for decentralized finance, DeFi refers to financial services for crypto, such as borrowing, lending, and trading, that are usually facilitated using smart contracts on the blockchain. They are often open-source and noncustodial.'
    })
  },
  {
    title: 'Is DeFiZap safe?',
    component: TranslateMarkdown({
      source:
        "There's always risk when interacting with DeFi and smart contracts, and DeFiZap is an experimental project that is in beta. Using a service like DeFiZap to interact with protocols for you does add a small amount of additional risk, but most of the risk stems from the actual protocols that are being interacted with."
    })
  },
  {
    title: 'Which protocols does DeFiZap interact with and where can I learn about them?',
    component: ProtocolsExplainer()
  },
  {
    title: 'Which Zaps are available?',
    component: AvailableZaps()
  },
  {
    title:
      'How is the MyCrypto DeFiZap integration different from the functionality of DeFiZap.com?',
    component: TranslateMarkdown({
      source:
        'The MyCrypto DeFiZap integration uses the same process as the DeFiZap.com process. MyCrypto’s DeFiZap integration adds an extra layer of convenience by allowing you to access Zaps without having to leave MyCrypto. For the full list of available Zaps, visit [DeFiZap.com](https://defizap.com).'
    })
  },
  {
    title: 'After entering a Zap, how do I exit?',
    component: TranslateMarkdown({
      source:
        'To exit a Zap, please visit [DeFiZap.com](https://defizap.com), go to the Zap that you’re currently engaged with, and follow the steps that they outline.'
    })
  },
  {
    title: 'How do I see my DeFiZap balances?',
    component: TranslateMarkdown({
      source:
        'Due to technical limitations, at this time we’re only currently able to give an estimate on some Zap balances, and DeFiZap recommends checking [pools.fyi](https://pools.fyi/) to view some of your balances/returns. Over time, as we and DeFiZap explore this further, we anticipate that there will be a better solution for this.'
    })
  }
];
