import { fAccount, fAccounts, fAssets, fNetworks } from '@fixtures';
import { IProvidersMappings, NodeOptions, StoreAsset, TUuid } from '@types';

import {
  buildCoinGeckoIdMapping,
  destructureCoinGeckoIds,
  mergeAssets,
  mergeNetworks,
  serializeAccount,
  serializeNotification
} from './helpers';

describe('serializeAccount()', () => {
  const serializedAccountAssets = {
    assets: [
      {
        balance: '1989726000000000000',
        decimal: 18,
        isCustom: false,
        name: 'Ether',
        networkId: 'Ethereum',
        ticker: 'ETH',
        type: 'base',
        uuid: '356a192b-7913-504c-9457-4d18c28d46e6'
      },
      {
        balance: '4000000000000000000',
        contractAddress: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
        decimal: 18,
        isCustom: false,
        name: 'REPv1',
        networkId: 'Ethereum',
        ticker: 'REPv1',
        type: 'erc20',
        uuid: 'd017a1e8-bdd3-5c32-8866-da258f75b0e9'
      }
    ]
  };

  test('it transforms assets bigish values to strings', () => {
    expect(serializeAccount(fAccounts[0])).toMatchObject(serializedAccountAssets);
  });

  test('it handles an empty asset array', () => {
    const withoutAssets = { ...fAccount, assets: [] };
    expect(serializeAccount(withoutAssets)).toMatchObject({ assets: [] });
  });

  test('it handles an asset balance which is already a serialized', () => {
    const account = fAccounts[0];
    const withSerializedAsset = {
      ...account,
      assets: [
        account.assets[0],
        ({ ...account.assets[1], balance: '4000000000000000000' } as unknown) as StoreAsset
      ]
    };
    expect(serializeAccount(withSerializedAsset)).toMatchObject(serializedAccountAssets);
  });

  test('it serializes transaction values to strings', () => {
    expect(serializeAccount(fAccounts[0])).toMatchObject({ transactions: [] });
  });
});

describe('serializeNotification', () => {
  const notification = {
    uuid: 'eaa7e237-7ce5-4a43-a448-e2a37426a48d' as TUuid,
    template: 'wallet-created',
    templateData: {
      address: 'N3WAddre3ssCreated',
      firstDashboardVisitDate: new Date('2020-11-27T15:08:26.825Z'),
      previousNotificationCloseDate: new Date('2020-11-28T15:08:26.825Z')
    },
    dateDisplayed: new Date('2020-11-26T14:56:23.136Z'),
    dateDismissed: new Date('2020-11-25T15:08:26.825Z'),
    dismissed: false
  };

  test('it transforms dates to strings', () => {
    const actual = serializeNotification(notification);
    expect(actual.templateData!.firstDashboardVisitDate).toEqual('2020-11-27T15:08:26.825Z');
    expect(actual.templateData!.previousNotificationCloseDate).toEqual('2020-11-28T15:08:26.825Z');
    expect(actual.dateDismissed).toEqual('2020-11-25T15:08:26.825Z');
    expect(actual.dateDisplayed).toEqual('2020-11-26T14:56:23.136Z');
  });

  test('it handles undefined props', () => {
    const actual = serializeNotification({ ...notification, dateDismissed: undefined });
    expect(actual.dateDismissed).toBeUndefined();
  });
});

describe('mergeNetworks', () => {
  test('it correctly merges when no custom nodes are present', () => {
    const actual = mergeNetworks(fNetworks, fNetworks);
    expect(actual).toEqual(fNetworks);
  });

  test('it correctly merges when custom nodes are present', () => {
    const nodeName = 'MyNode';
    const nodes = [...fNetworks[0].nodes, { name: nodeName, isCustom: true } as NodeOptions];
    const actual = mergeNetworks(
      [{ ...fNetworks[0], nodes, selectedNode: nodeName }, fNetworks[1]],
      fNetworks
    );
    expect(actual).toEqual([
      { ...fNetworks[0], nodes, selectedNode: nodeName },
      fNetworks[1],
      fNetworks[2]
    ]);
  });

  test('it supports merging with new networks in initial state', () => {
    const nodeName = 'eth_ethscan';
    const actual = mergeNetworks([], [{ ...fNetworks[0], selectedNode: nodeName }]);
    expect(actual).toEqual([{ ...fNetworks[0], selectedNode: nodeName }]);
  });

  test('it correctly merges when static info has changed', () => {
    const [first, ...rest] = fNetworks[0].nodes;
    const nodes = [{ ...first, disableByDefault: true }, ...rest];
    const actual = mergeNetworks([fNetworks[0]], [{ ...fNetworks[0], nodes }]);
    expect(actual).toEqual([{ ...fNetworks[0], nodes }]);
  });

  test('it correctly merges when nodes have been deleted', () => {
    const [, ...nodes] = fNetworks[0].nodes;
    const actual = mergeNetworks([fNetworks[0]], [{ ...fNetworks[0], nodes }]);
    expect(actual).toEqual([{ ...fNetworks[0], nodes }]);
  });
});

describe('mergeAssets', () => {
  it('correctly does basic merging', () => {
    const actual = mergeAssets([fAssets[0]], [fAssets[1]]);
    expect(actual).toEqual(expect.arrayContaining([fAssets[0], fAssets[1]]));
  });

  it('merges to include extra mapping information', () => {
    const detailedAsset = { ...fAssets[0], mappings: { coinGeckoId: 'ethereum' } };
    const actual = mergeAssets([detailedAsset], fAssets);
    const [, ...rest] = fAssets;
    expect(actual).toEqual([detailedAsset, ...rest]);
  });
});

describe('destructureCoinGeckoIds()', () => {
  it('returns a new object with asset uuid as key', () => {
    const rates = {
      usd: 1524.39,
      eur: 1280.09
    };

    const coinGeckoIdMapping = {
      '356a192b-7913-504c-9457-4d18c28d46e6': 'ethereum'
    };
    const expected = {
      '356a192b-7913-504c-9457-4d18c28d46e6': rates
    };

    const result = destructureCoinGeckoIds({ ethereum: rates }, coinGeckoIdMapping);

    expect(result).toEqual(expected);
  });
});

describe('buildCoinGeckoIdMapping', () => {
  it('transforms a list of ExtendedAsset to a list of coingecko ids with asset uuid as key', () => {
    const assets = {
      [fAssets[0].uuid]: { coinGeckoId: fAssets[0].name, cryptoCompareId: 'notRelevant' },
      [fAssets[1].uuid]: { coinGeckoId: fAssets[1].name },
      [fAssets[2].uuid]: { cryptoCompareId: 'anotherOne' }
    } as Record<string, IProvidersMappings>;

    const expected = {
      [fAssets[0].uuid]: fAssets[0].name,
      [fAssets[1].uuid]: fAssets[1].name
    };

    const result = buildCoinGeckoIdMapping(assets);

    expect(result).toEqual(expected);
    expect(result[fAssets[0].uuid]).not.toContain(assets[fAssets[0].uuid].cryptoCompareId);
    expect(Object.keys(result)).not.toContain(fAssets[2].uuid);
  });
});
