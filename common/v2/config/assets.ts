import { Asset } from 'v2/types';

export const assets: { [key in string]: Asset } = {
  '10e14757-78bb-4bb2-a17a-8333830f6698': {
    uuid: '10e14757-78bb-4bb2-a17a-8333830f6698',
    name: 'WrappedETH',
    networkId: 'Homestead',
    type: 'erc20',
    ticker: 'WETH',
    contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimal: 18
  },
  'f7e30bbe-08e2-41ce-9231-5236e6aab702': {
    uuid: 'f7e30bbe-08e2-41ce-9231-5236e6aab702',
    name: 'Ether',
    networkId: 'Homestead',
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
  }
};
