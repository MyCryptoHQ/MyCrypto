import { BigNumber } from '@ethersproject/bignumber';

import {
  ANTv1UUID,
  DAIUUID,
  DEFAULT_ASSET_DECIMAL,
  DEFAULT_NETWORK,
  LENDUUID,
  REPV1UUID,
  REPV2UUID,
  XDAI_NETWORK,
  XDAIUUID
} from '@config';
import { ExtendedAsset, StoreAsset, TTicker, TUuid } from '@types';

export const fRopDAI: ExtendedAsset = {
  uuid: '2783a9ff-d6f1-5c9e-bbab-3b74be91adb1' as TUuid,
  name: 'RopDAI',
  decimal: 18,
  ticker: 'RopDAI' as TTicker,
  networkId: 'Ropsten',
  contractAddress: '0xad6d458402f60fd3bd25163575031acdce07538d',
  isCustom: true,
  type: 'erc20'
};

export const fDAI: ExtendedAsset = {
  uuid: DAIUUID as TUuid,
  name: 'DAI v2',
  decimal: 18,
  ticker: 'DAI' as TTicker,
  networkId: DEFAULT_NETWORK,
  contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  isCustom: false,
  type: 'erc20'
};

export const fAssets = [
  {
    uuid: '356a192b-7913-504c-9457-4d18c28d46e6',
    name: 'Ether',
    networkId: 'Ethereum',
    type: 'base',
    ticker: 'ETH',
    decimal: 18,
    isCustom: false
  },
  {
    uuid: '77de68da-ecd8-53ba-bbb5-8edb1c8e14d7',
    name: 'Ropsten',
    networkId: 'Ropsten',
    type: 'base',
    ticker: 'RopstenETH',
    decimal: 18,
    isCustom: false
  },
  {
    uuid: '92cfceb3-9d57-5914-ad8b-14d0e37643de',
    name: 'KovanETH',
    networkId: 'Kovan',
    type: 'base',
    ticker: 'KovanETH',
    decimal: 18,
    isCustom: false
  },
  {
    uuid: '1b645389-2473-5467-9073-72d45eb05abc',
    name: 'RinkebyETH',
    networkId: 'Rinkeby',
    type: 'base',
    ticker: 'RinkebyETH',
    decimal: 18,
    isCustom: false
  },
  {
    uuid: 'ac3478d6-9a3c-51fa-a2e6-0f5c3696165a',
    name: 'GoerliETH',
    networkId: 'Goerli',
    type: 'base',
    ticker: 'GoerliETH',
    decimal: 18,
    isCustom: false
  },
  {
    uuid: '6c1e671f-9af5-546d-9c1a-52067bdf0e53',
    ticker: 'ETC',
    name: 'Ethereum Classic',
    networkId: 'ETC',
    type: 'base',
    decimal: 18,
    isCustom: false
  },
  {
    uuid: 'fe5dbbce-a5ce-5e29-88b8-c69bcfdfde89',
    ticker: 'UBQ',
    name: 'Ubiq',
    networkId: 'UBQ',
    type: 'base',
    decimal: 18,
    isCustom: false
  },
  {
    uuid: 'da4b9237-bacc-5df1-9c07-60cab7aec4a8',
    ticker: 'EXP',
    name: 'Expanse',
    networkId: 'EXP',
    type: 'base',
    decimal: 18,
    isCustom: false
  },
  {
    uuid: '9a79be61-1e02-57e1-9943-da0737c6c51b',
    ticker: 'POA',
    name: 'POA',
    networkId: 'POA',
    type: 'base',
    decimal: 18,
    isCustom: false
  },
  {
    uuid: 'b37f6ddc-efad-5e86-9783-7d3177f9ef24',
    ticker: 'TOMO',
    name: 'TomoChain',
    networkId: 'TOMO',
    type: 'base',
    decimal: 18,
    isCustom: false
  },
  {
    uuid: REPV1UUID,
    name: 'REPv1',
    decimal: 18,
    ticker: 'REPv1',
    networkId: 'Ethereum',
    contractAddress: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
    isCustom: false,
    type: 'erc20'
  },
  {
    uuid: REPV2UUID,
    name: 'REPv2',
    decimal: 18,
    ticker: 'REPv2',
    networkId: 'Ethereum',
    contractAddress: '0x221657776846890989a759BA2973e427DfF5C9bB',
    isCustom: false,
    type: 'erc20'
  },
  {
    uuid: LENDUUID,
    name: 'LEND',
    decimal: 18,
    ticker: 'LEND',
    networkId: 'Ethereum',
    contractAddress: '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03',
    isCustom: false,
    type: 'erc20'
  },
  {
    uuid: ANTv1UUID,
    name: 'ANTv1',
    decimal: 18,
    ticker: 'ANTv1',
    networkId: 'Ethereum',
    contractAddress: '0x960b236A07cf122663c4303350609A66A7B288C0',
    isCustom: false,
    type: 'erc20'
  },
  {
    uuid: XDAIUUID,
    name: 'xDAI',
    type: 'base',
    networkId: XDAI_NETWORK,
    isCustom: false,
    ticker: 'xDAI'
  },
  {
    uuid: '54ceb912-56e8-590e-874a-a752a6e0650a',
    name: 'Smart Chain (Smart Chain)',
    ticker: 'BNB',
    type: 'base',
    networkId: 'SmartChain',
    isCustom: false
  },
  fDAI,
  fRopDAI
] as ExtendedAsset[];

export const fStoreAssets = [
  {
    uuid: '10e14757-78bb-4bb2-a17a-8333830f6698',
    name: 'WrappedETH',
    networkId: 'Ethereum',
    type: 'erc20',
    ticker: 'WETH' as TTicker,
    contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimal: DEFAULT_ASSET_DECIMAL,
    balance: BigNumber.from(1)
  },
  {
    uuid: 'f7e30bbe-08e2-41ce-9231-5236e6aab702',
    name: 'Ether',
    networkId: 'Ethereum',
    type: 'base',
    ticker: 'ETH',
    decimal: DEFAULT_ASSET_DECIMAL,
    balance: BigNumber.from(1)
  },
  {
    uuid: '12d3cbf2-de3a-4050-a0c6-521592e4b85a',
    name: 'GoerliETH',
    networkId: 'Goerli',
    type: 'base',
    ticker: 'GoerliETH',
    decimal: DEFAULT_ASSET_DECIMAL,
    balance: BigNumber.from(1)
  },
  {
    uuid: '01f2d4ec-c263-6ba8-de38-01d66c86f309',
    name: 'RopstenETH',
    networkId: 'Ropsten',
    type: 'base',
    ticker: 'RopstenETH',
    decimal: DEFAULT_ASSET_DECIMAL,
    balance: BigNumber.from(21)
  }
] as StoreAsset[];

export const fAsset: StoreAsset = Object.assign({}, fAssets[2], {
  balance: BigNumber.from('0x1b9ced41465be000')
});
