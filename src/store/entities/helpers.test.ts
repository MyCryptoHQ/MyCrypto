import { fAccount, fAccounts } from '@fixtures';
import { StoreAsset } from '@types';

import { serializeAccount } from './helpers';

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

describe('serializeAccount()', () => {
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
