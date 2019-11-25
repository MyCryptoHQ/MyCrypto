import { Asset, TUuid } from 'v2/types';
import { DEFAULT_ASSET_DECIMAL } from 'v2/config';

export const assets: { [key in string]: Asset } = {
  '10e14757-78bb-4bb2-a17a-8333830f6698': {
    uuid: '10e14757-78bb-4bb2-a17a-8333830f6698' as TUuid,
    name: 'WrappedETH',
    networkId: 'Ethereum',
    type: 'erc20',
    ticker: 'WETH',
    contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimal: DEFAULT_ASSET_DECIMAL
  },
  'f7e30bbe-08e2-41ce-9231-5236e6aab702': {
    uuid: 'f7e30bbe-08e2-41ce-9231-5236e6aab702' as TUuid,
    name: 'Ether',
    networkId: 'Ethereum',
    type: 'base',
    ticker: 'ETH',
    decimal: DEFAULT_ASSET_DECIMAL
  },
  '12d3cbf2-de3a-4050-a0c6-521592e4b85a': {
    uuid: '12d3cbf2-de3a-4050-a0c6-521592e4b85a' as TUuid,
    name: 'GoerliETH',
    networkId: 'Goerli',
    type: 'base',
    ticker: 'GoerliETH',
    decimal: DEFAULT_ASSET_DECIMAL
  },
  '01f2d4ec-c263-6ba8-de38-01d66c86f309': {
    uuid: '01f2d4ec-c263-6ba8-de38-01d66c86f309' as TUuid,
    name: 'RopstenETH',
    networkId: 'Ropsten',
    type: 'base',
    ticker: 'RopstenETH',
    decimal: DEFAULT_ASSET_DECIMAL
  },
  '89397517-5dcb-9cd1-76b5-224e3f0ace80': {
    uuid: '89397517-5dcb-9cd1-76b5-224e3f0ace80' as TUuid,
    name: 'RinkebyETH',
    networkId: 'Rinkeby',
    type: 'base',
    ticker: 'RinkebyETH',
    decimal: DEFAULT_ASSET_DECIMAL
  },
  '4d8b9524-e2c8-243b-cdca-c0a9f27a3b01': {
    uuid: '4d8b9524-e2c8-243b-cdca-c0a9f27a3b01' as TUuid,
    name: 'KovanETH',
    networkId: 'Kovan',
    type: 'base',
    ticker: 'KovanETH',
    decimal: DEFAULT_ASSET_DECIMAL
  },
  'ffb050ad-968c-1b7a-66d1-376e1e446e2f': {
    uuid: 'ffb050ad-968c-1b7a-66d1-376e1e446e2f' as TUuid,
    name: 'DAI',
    networkId: 'Ropsten',
    type: 'erc20',
    ticker: 'DAI',
    contractAddress: '0xad6d458402f60fd3bd25163575031acdce07538d',
    decimal: DEFAULT_ASSET_DECIMAL
  },
  'abd99e06-5af1-17b6-c3ea-361785b38acc': {
    uuid: 'abd99e06-5af1-17b6-c3ea-361785b38acc' as TUuid,
    name: 'Basic Attention Token',
    networkId: 'Ropsten',
    type: 'erc20',
    ticker: 'BAT',
    contractAddress: '0xdb0040451f373949a4be60dcd7b6b8d6e42658b6',
    decimal: DEFAULT_ASSET_DECIMAL
  },
  '0bc4af47-39a0-df9f-1001-ce46c3b91998': {
    uuid: '0bc4af47-39a0-df9f-1001-ce46c3b91998' as TUuid,
    name: 'OmiseGO',
    networkId: 'Ropsten',
    type: 'erc20',
    ticker: 'OMG',
    contractAddress: '0x4BFBa4a8F28755Cb2061c413459EE562c6B9c51b',
    decimal: DEFAULT_ASSET_DECIMAL
  },

  'ccafaddd-16bc-2d61-b40d-5ccaac7e9ad0': {
    uuid: 'ccafaddd-16bc-2d61-b40d-5ccaac7e9ad0' as TUuid,
    name: 'Dai Stablecoin',
    networkId: 'Rinkeby',
    type: 'erc20',
    ticker: 'DAI',
    contractAddress: '0x2448ee2641d78cc42d7ad76498917359d961a783',
    decimal: DEFAULT_ASSET_DECIMAL
  },
  '0e22bc58-3a71-c6f7-c649-cd32e5bfcccc': {
    uuid: '0e22bc58-3a71-c6f7-c649-cd32e5bfcccc' as TUuid,
    name: 'Basic Attention Token',
    networkId: 'Rinkeby',
    type: 'erc20',
    ticker: 'BAT',
    contractAddress: '0xda5b056cfb861282b4b59d29c9b395bcc238d29b',
    decimal: DEFAULT_ASSET_DECIMAL
  },
  'ae8388ab-fc6a-0655-9a74-2c04f438bde2': {
    uuid: 'ae8388ab-fc6a-0655-9a74-2c04f438bde2' as TUuid,
    name: 'OMGToken',
    networkId: 'Rinkeby',
    type: 'erc20',
    ticker: 'OMG',
    contractAddress: '0x879884c3c46a24f56089f3bbbe4d5e38db5788c0',
    decimal: DEFAULT_ASSET_DECIMAL
  },

  '0c064d99-7912-baca-5129-e0f410a495f7': {
    uuid: '0c064d99-7912-baca-5129-e0f410a495f7' as TUuid,
    name: 'DAI Stablecoin Kovan',
    networkId: 'Kovan',
    type: 'erc20',
    ticker: 'DAI',
    contractAddress: '0x4c38cdc08f1260f5c4b21685654393bb1e66a858',
    decimal: DEFAULT_ASSET_DECIMAL
  },
  '9e8410c9-f470-4361-7088-487eba669a34': {
    uuid: '9e8410c9-f470-4361-7088-487eba669a34' as TUuid,
    name: 'Maker Kovan',
    networkId: 'Kovan',
    type: 'erc20',
    ticker: 'MKR',
    contractAddress: '0xac94ea989f6955c67200dd67f0101e1865a560ea',
    decimal: DEFAULT_ASSET_DECIMAL
  }
};
