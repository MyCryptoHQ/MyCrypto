import { Overwrite } from 'utility-types';

import { AssetBalanceObject, IRawAccount, TAddress, TTicker, TUuid, WalletId } from '@types';

export interface SeedAssetBalance extends AssetBalanceObject {
  ticker: TTicker;
}

export type DevAccount = Overwrite<
  IRawAccount,
  {
    assets: SeedAssetBalance[];
  }
>;

export const devAccounts: DevAccount[] = [
  {
    address: '0xc7bfc8a6bd4e52bfe901764143abef76caf2f912' as TAddress,
    networkId: 'Ethereum',
    assets: [
      {
        uuid: '10e14757-78bb-4bb2-a17a-8333830f6698' as TUuid,
        ticker: 'WETH' as TTicker,
        balance: '100000000000000',
        mtime: Date.now()
      },
      {
        uuid: 'f7e30bbe-08e2-41ce-9231-5236e6aab702' as TUuid,
        ticker: 'ETH' as TTicker,
        balance: '100000000000000',
        mtime: Date.now()
      }
    ],
    wallet: WalletId.METAMASK,
    dPath: `m/44'/60'/0'/0/0`,
    transactions: [],
    mtime: Date.now(),
    favorite: true
  },
  {
    address: '0xc7bfc8a6bd4e52bfe901764143abef76caf2f912' as TAddress,
    networkId: 'Goerli',
    assets: [
      {
        uuid: '12d3cbf2-de3a-4050-a0c6-521592e4b85a' as TUuid,
        ticker: 'GoerliETH' as TTicker,
        balance: '100000000000000',
        mtime: Date.now()
      }
    ],
    wallet: WalletId.METAMASK,
    dPath: `m/44'/60'/0'/0/0`,
    transactions: [],
    mtime: Date.now(),
    favorite: true
  },
  {
    address: '0x82d69476357a03415e92b5780c89e5e9e972ce75' as TAddress,
    networkId: 'Ropsten',
    assets: [
      {
        uuid: '01f2d4ec-c263-6ba8-de38-01d66c86f309' as TUuid,
        ticker: 'RopstenETH' as TTicker,
        balance: '5000000000000000000',
        mtime: Date.now()
      },
      {
        uuid: 'ffb050ad-968c-1b7a-66d1-376e1e446e2f' as TUuid,
        ticker: 'DAI' as TTicker,
        balance: '10000000000000000000',
        mtime: Date.now()
      },
      {
        uuid: 'abd99e06-5af1-17b6-c3ea-361785b38acc' as TUuid,
        ticker: 'BAT' as TTicker,
        balance: '1000000000000000000',
        mtime: Date.now()
      },
      {
        uuid: '0bc4af47-39a0-df9f-1001-ce46c3b91998' as TUuid,
        ticker: 'OMG' as TTicker,
        balance: '10000000000000000000',
        mtime: Date.now()
      }
    ],
    wallet: WalletId.METAMASK,
    dPath: `m/44'/60'/0'/0/0`,
    transactions: [],
    mtime: Date.now(),
    favorite: true
  },
  {
    address: '0x8fe684ae26557DfFF70ceE9a4Ff5ee7251a31AD5' as TAddress,
    networkId: 'Rinkeby',
    assets: [
      {
        uuid: '89397517-5dcb-9cd1-76b5-224e3f0ace80' as TUuid,
        ticker: 'RinkebyETH' as TTicker,
        balance: '5000000000000000000',
        mtime: Date.now()
      },
      {
        uuid: 'ccafaddd-16bc-2d61-b40d-5ccaac7e9ad0' as TUuid,
        ticker: 'DAI' as TTicker,
        balance: '2889036600000000000',
        mtime: Date.now()
      },
      {
        uuid: '0e22bc58-3a71-c6f7-c649-cd32e5bfcccc' as TUuid,
        ticker: 'BAT' as TTicker,
        balance: '43841287560000000000',
        mtime: Date.now()
      },
      {
        uuid: 'ae8388ab-fc6a-0655-9a74-2c04f438bde2' as TUuid,
        ticker: 'OMG' as TTicker,
        balance: '16822485830000000000',
        mtime: Date.now()
      }
    ],
    wallet: WalletId.METAMASK,
    dPath: `m/44'/60'/0'/0/0`,
    transactions: [],
    mtime: Date.now(),
    favorite: true
  },
  {
    address: '0xd57478a81CF7DcA65996Ef0550367467cbD6309f' as TAddress,
    networkId: 'Kovan',
    assets: [
      {
        uuid: '4d8b9524-e2c8-243b-cdca-c0a9f27a3b01' as TUuid,
        ticker: 'KovanETH' as TTicker,
        balance: '5000000000000000000',
        mtime: Date.now()
      },
      {
        uuid: '0c064d99-7912-baca-5129-e0f410a495f7' as TUuid,
        ticker: 'DAI' as TTicker,
        balance: '1044780860000000000',
        mtime: Date.now()
      },
      {
        uuid: '9e8410c9-f470-4361-7088-487eba669a34' as TUuid,
        ticker: 'MKR' as TTicker,
        balance: '176513630000000000',
        mtime: Date.now()
      }
    ],
    wallet: WalletId.METAMASK,
    dPath: `m/44'/60'/0'/0/0`,
    transactions: [],
    mtime: Date.now(),
    favorite: true
  }
];
