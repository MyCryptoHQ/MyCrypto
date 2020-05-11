import { bigNumberify } from 'ethers/utils';
import { StoreAsset, TUuid } from '@types';
import { getTotalByAsset } from '../helpers';

const DEFAULT_ASSET_DECIMAL = 18;
const assets: StoreAsset[] = [
  {
    uuid: '10e14757-78bb-4bb2-a17a-8333830f6698' as TUuid,
    name: 'WrappedETH',
    networkId: 'Ethereum',
    type: 'erc20',
    ticker: 'WETH',
    contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    decimal: DEFAULT_ASSET_DECIMAL,
    balance: bigNumberify(1),
    mtime: Date.now()
  },
  {
    uuid: 'f7e30bbe-08e2-41ce-9231-5236e6aab702' as TUuid,
    name: 'Ether',
    networkId: 'Ethereum',
    type: 'base',
    ticker: 'ETH',
    decimal: DEFAULT_ASSET_DECIMAL,
    balance: bigNumberify(1),
    mtime: Date.now()
  },
  {
    uuid: '12d3cbf2-de3a-4050-a0c6-521592e4b85a' as TUuid,
    name: 'GoerliETH',
    networkId: 'Goerli',
    type: 'base',
    ticker: 'GoerliETH',
    decimal: DEFAULT_ASSET_DECIMAL,
    balance: bigNumberify(1),
    mtime: Date.now()
  },
  {
    uuid: '01f2d4ec-c263-6ba8-de38-01d66c86f309' as TUuid,
    name: 'RopstenETH',
    networkId: 'Ropsten',
    type: 'base',
    ticker: 'RopstenETH',
    decimal: DEFAULT_ASSET_DECIMAL,
    balance: bigNumberify(21),
    mtime: Date.now()
  }
];

describe('getTotalByAsset()', () => {
  it('returns a list of unique assets', () => {
    const totals = getTotalByAsset([...assets, ...assets]);
    expect(Object.keys(totals).length).toEqual(assets.length);
  });
  it('sums the balances of each asset', () => {
    const totals = getTotalByAsset([...assets, ...assets]);
    const targetId = '01f2d4ec-c263-6ba8-de38-01d66c86f309';
    const targetAsset = assets.find((a) => a.uuid === targetId);
    expect(totals[targetId].balance.toString()).toEqual(targetAsset!.balance.mul('2').toString());
  });
});
