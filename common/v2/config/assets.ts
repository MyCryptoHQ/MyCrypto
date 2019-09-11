import { Asset } from 'v2/types';

export const assets: { [key in string]: Asset } = {
  '10e14757-78bb-4bb2-a17a-8333830f6698': {
    uuid: '10e14757-78bb-4bb2-a17a-8333830f6698',
    name: 'WrappedETH',
    networkId: 'Ethereum',
    type: 'erc20',
    ticker: 'WETH',
    contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimal: 18
  },
  'f7e30bbe-08e2-41ce-9231-5236e6aab702': {
    uuid: 'f7e30bbe-08e2-41ce-9231-5236e6aab702',
    name: 'Ether',
    networkId: 'Ethereum',
    type: 'base',
    ticker: 'ETH',
    decimal: 18
  },
  '12d3cbf2-de3a-4050-a0c6-521592e4b85a': {
    uuid: '12d3cbf2-de3a-4050-a0c6-521592e4b85a',
    name: 'GoerliETH',
    networkId: 'Goerli',
    type: 'base',
    ticker: 'GoerliETH',
    decimal: 18
  },
  '01f2d4ec-c263-6ba8-de38-01d66c86f309': {
    uuid: '01f2d4ec-c263-6ba8-de38-01d66c86f309',
    name: 'RopstenETH',
    networkId: 'Ropsten',
    type: 'base',
    ticker: 'RopstenETH',
    decimal: 18
  },
  '89397517-5dcb-9cd1-76b5-224e3f0ace80': {
    uuid: '89397517-5dcb-9cd1-76b5-224e3f0ace80',
    name: 'RinkebyETH',
    networkId: 'Rinkeby',
    type: 'base',
    ticker: 'RinkebyETH',
    decimal: 18
  },
  '4d8b9524-e2c8-243b-cdca-c0a9f27a3b01': {
    uuid: '4d8b9524-e2c8-243b-cdca-c0a9f27a3b01',
    name: 'KovanETH',
    networkId: 'Kovan',
    type: 'base',
    ticker: 'KovanETH',
    decimal: 18
  }
};
