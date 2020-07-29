import { bigNumberify } from 'ethers/utils';
import { StoreAccount, TUuid, TAddress, WalletId } from '@types';

import { fNetwork } from './network';

export const fAccounts: StoreAccount[] = [
  {
    address: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as TAddress,
    networkId: 'Ethereum',
    wallet: 'WALLETCONNECT' as WalletId,
    dPath: '',
    assets: [
      {
        uuid: '356a192b-7913-504c-9457-4d18c28d46e6' as TUuid,
        name: 'Ether',
        networkId: 'Ethereum',
        type: 'base',
        ticker: 'ETH',
        decimal: 18,
        mappings: {},
        isCustom: false,
        balance: bigNumberify('0x1b9ced41465be000'),
        mtime: 1581530607024
      }
    ],
    transactions: [],
    favorite: false,
    mtime: 0,
    uuid: '4ffb0d4a-adf3-1990-5eb9-fe78e613f70b' as TUuid,
    network: fNetwork,
    label: 'WalletConnect Account 1'
  },
  {
    address: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as TAddress,
    networkId: 'Ropsten',
    wallet: 'LEDGER' as WalletId,
    dPath: '',
    assets: [
      {
        uuid: '77de68da-ecd8-53ba-bbb5-8edb1c8e14d7' as TUuid,
        name: 'Ropsten',
        networkId: 'Ropsten',
        type: 'base',
        ticker: 'RopstenETH',
        decimal: 18,
        mappings: {},
        isCustom: false,
        balance: bigNumberify('0x1b9ced41465be000'),
        mtime: 1581530607024
      }
    ],

    transactions: [],
    favorite: false,
    mtime: 0,
    uuid: '4ffb0d4a-adf3-1990-5eb9-fe78e613f70b' as TUuid,
    network: fNetwork,
    label: 'Ledger Account'
  }
];

export const fAccount: StoreAccount = fAccounts[1];
