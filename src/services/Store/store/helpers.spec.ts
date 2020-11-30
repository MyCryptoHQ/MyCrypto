import { fAccount, fAccounts } from '@fixtures';
import { StoreAsset, TUuid } from '@types';

import { serializeAccount, serializeNotification } from './helpers';

describe('serializeAccount()', () => {
  const serializedAccountAssets = {
    assets: [
      {
        balance: '1989726000000000000',
        decimal: 18,
        isCustom: false,
        mtime: 1581530607024,
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
        mtime: 1581530607024,
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
