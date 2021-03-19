import { BigNumber } from '@ethersproject/bignumber';

import { REPV1UUID } from '@config';
import { DWAccountDisplay, ExtendedDPath } from '@services';
import { StoreAccount, TAddress, TTicker, TUuid, WalletId } from '@types';
import { bigify } from '@utils';

import { fNetwork, fNetworks } from './network';

export const fAccounts: StoreAccount[] = [
  {
    address: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as TAddress,
    networkId: 'Ethereum',
    wallet: 'WALLETCONNECT' as WalletId,
    dPath: "m/44'/1'/0'/0", // Mnemonic dPath
    assets: [
      {
        uuid: '356a192b-7913-504c-9457-4d18c28d46e6' as TUuid,
        name: 'Ether',
        networkId: 'Ethereum',
        type: 'base',
        ticker: 'ETH' as TTicker,
        decimal: 18,
        isCustom: false,
        balance: BigNumber.from('0x1b9ced41465be000'),
        mtime: 1581530607024
      },
      {
        uuid: REPV1UUID,
        name: 'REPv1',
        networkId: 'Ethereum',
        type: 'erc20',
        ticker: 'REPv1' as TTicker,
        decimal: 18,
        contractAddress: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
        isCustom: false,
        balance: BigNumber.from('0x3782dace9d900000'),
        mtime: 1581530607024
      }
    ],
    transactions: [],
    favorite: false,
    mtime: 0,
    uuid: '15d5e8f3-c595-5206-b5f3-86c180eb7119' as TUuid,
    network: fNetworks[0],
    label: 'WalletConnect Account 1'
  },
  {
    address: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as TAddress,
    networkId: 'Ropsten',
    wallet: 'LEDGER_NANO_S' as WalletId,
    dPath: "m/44'/60'/0'", // Ledger dPath
    assets: [
      {
        uuid: '77de68da-ecd8-53ba-bbb5-8edb1c8e14d7' as TUuid,
        name: 'Ropsten',
        networkId: 'Ropsten',
        type: 'base',
        ticker: 'RopstenETH' as TTicker,
        decimal: 18,
        isCustom: false,
        balance: BigNumber.from('0x1b9ced41465be000'),
        mtime: 1581530607024
      }
    ],

    transactions: [],
    favorite: false,
    mtime: 0,
    uuid: '4ffb0d4a-adf3-1990-5eb9-fe78e613f70c' as TUuid,
    network: fNetwork,
    label: 'Ledger Account'
  },
  {
    address: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017' as TAddress,
    networkId: 'Ropsten',
    wallet: 'LEDGER_NANO_S' as WalletId,
    dPath: "m/44'/60'/0'/0", // Ledger dPath
    assets: [
      {
        uuid: '2783a9ff-d6f1-5c9e-bbab-3b74be91adb1' as TUuid,
        name: 'RopDAI',
        decimal: 18,
        ticker: 'RopDAI' as TTicker,
        networkId: 'Ropsten',
        contractAddress: '0xad6d458402f60fd3bd25163575031acdce07538d',
        type: 'erc20',
        isCustom: true,
        balance: BigNumber.from('0x54ab1b2ceea88000'),
        mtime: 1581530607024
      },
      {
        uuid: '77de68da-ecd8-53ba-bbb5-8edb1c8e14d7' as TUuid,
        name: 'Ropsten',
        networkId: 'Ropsten',
        type: 'base',
        ticker: 'RopstenETH' as TTicker,
        decimal: 18,
        isCustom: false,
        balance: BigNumber.from('0x0e2347cb6425dc00'),
        mtime: 1581530607024
      }
    ],
    transactions: [],
    favorite: false,
    mtime: 0,
    uuid: 'cd36fc7c-adda-54ce-825b-f19a55bbc1ad' as TUuid,
    network: fNetwork,
    label: 'Ledger Nano S Account 1'
  },
  {
    address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress,
    networkId: 'Ropsten',
    wallet: WalletId.VIEW_ONLY,
    dPath: "m/44'/60'/0'/0", // Ledger dPath
    assets: [
      {
        uuid: '2783a9ff-d6f1-5c9e-bbab-3b74be91adb1' as TUuid,
        name: 'RopDAI',
        decimal: 18,
        ticker: 'RopDAI' as TTicker,
        networkId: 'Ropsten',
        contractAddress: '0xad6d458402f60fd3bd25163575031acdce07538d',
        type: 'erc20',
        isCustom: true,
        balance: BigNumber.from('0x54ab1b2ceea88000'),
        mtime: 1581530607024
      },
      {
        uuid: '77de68da-ecd8-53ba-bbb5-8edb1c8e14d7' as TUuid,
        name: 'Ropsten',
        networkId: 'Ropsten',
        type: 'base',
        ticker: 'RopstenETH' as TTicker,
        decimal: 18,
        isCustom: false,
        balance: BigNumber.from('0x0e2347cb6425dc00'),
        mtime: 1581530607024
      }
    ],
    transactions: [],
    favorite: false,
    mtime: 0,
    uuid: 'cd36fc7c-adda-54ce-825b-f19a55bbc1au' as TUuid,
    network: fNetwork,
    label: 'View Only Address 1'
  },
  {
    address: '0x9458a933f00da9a927dbbb9cc2ae3fe7dfa9aed5' as TAddress,
    networkId: 'Ropsten',
    wallet: WalletId.TRUST,
    dPath: "m/44'/60'/0'/0", // Ledger dPath
    assets: [
      {
        uuid: '2783a9ff-d6f1-5c9e-bbab-3b74be91adb1' as TUuid,
        name: 'RopDAI',
        decimal: 18,
        ticker: 'RopDAI' as TTicker,
        networkId: 'Ropsten',
        contractAddress: '0xad6d458402f60fd3bd25163575031acdce07538d',
        type: 'erc20',
        isCustom: true,
        balance: BigNumber.from('0x54ab1b2ceea88000'),
        mtime: 1581530607024
      },
      {
        uuid: '77de68da-ecd8-53ba-bbb5-8edb1c8e14d7' as TUuid,
        name: 'Ropsten',
        networkId: 'Ropsten',
        type: 'base',
        ticker: 'RopstenETH' as TTicker,
        decimal: 18,

        isCustom: false,
        balance: BigNumber.from('0x0e2347cb6425dc00'),
        mtime: 1581530607024
      }
    ],
    transactions: [],
    favorite: false,
    mtime: 0,
    uuid: 'cd36fc7c-adda-54ce-825b-f19a55bbc1at' as TUuid,
    network: fNetwork,
    label: 'Trust Wallet Address 1'
  },
  {
    address: '0x03a0775e92dc3ad2d2cb3eaf58af5ee99b183d49' as TAddress,
    networkId: 'Ethereum',
    wallet: 'WALLETCONNECT' as WalletId,
    dPath: "m/44'/1'/0'/0", // Mnemonic dPath
    assets: [
      {
        uuid: '356a192b-7913-504c-9457-4d18c28d46e6' as TUuid,
        name: 'Ether',
        networkId: 'Ethereum',
        type: 'base',
        ticker: 'ETH' as TTicker,
        decimal: 18,
        isCustom: false,
        balance: BigNumber.from('0x1b9ced41465be000'),
        mtime: 1581530607024
      }
    ],
    transactions: [],
    favorite: false,
    mtime: 0,
    uuid: '4ffb0d4a-adf3-1990-5eb9-fe78e613f70y' as TUuid,
    network: fNetwork,
    label: 'WalletConnect Account 2'
  }
];

export const fDWAccounts: DWAccountDisplay[] = [
  {
    address: '0x982ae6031EBE31e1A01490dd4D3270003d732830' as TAddress,
    pathItem: {
      path: "m/44'/60'/0'/0",
      baseDPath: {
        label: 'Ledger (ETH)',
        value: "m/44'/60'/0'",
        offset: 0,
        numOfAddresses: 5
      } as ExtendedDPath,
      index: 0
    },
    balance: bigify('100000000000000000000')
  },
  {
    address: '0xE8C0F5417B272f2a1C24419bd2cF6B3F584c6b9A' as TAddress,
    pathItem: {
      path: "m/44'/60'/0'/1",
      baseDPath: {
        label: 'Ledger (ETH)',
        value: "m/44'/60'/0'",
        offset: 0,
        numOfAddresses: 5
      } as ExtendedDPath,
      index: 1
    },
    balance: bigify('0')
  },
  {
    address: '0xE8A0F5417B272f2a1C24419bd2cF6B3F584c6b9A' as TAddress,
    pathItem: {
      path: "m/44'/60'/0'/2",
      baseDPath: {
        label: 'Ledger (ETH)',
        value: "m/44'/60'/0'",
        offset: 0,
        numOfAddresses: 5
      } as ExtendedDPath,
      index: 1
    },
    balance: bigify('1000000000000000000')
  },
  {
    address: '0xE8B0F5417B272f2a1C24419bd2cF6B3F584c6b9A' as TAddress,
    pathItem: {
      path: "m/44'/60'/0'/3",
      baseDPath: {
        label: 'Ledger (ETH)',
        value: "m/44'/60'/0'",
        offset: 0,
        numOfAddresses: 5
      } as ExtendedDPath,
      index: 1
    },
    balance: bigify('1500000000000000000')
  },
  {
    address: '0xE8D0F5417B272f2a1C24419bd2cF6B3F584c6b9A' as TAddress,
    pathItem: {
      path: "m/44'/60'/0'/4",
      baseDPath: {
        label: 'Ledger (ETH)',
        value: "m/44'/60'/0'",
        offset: 0,
        numOfAddresses: 5
      } as ExtendedDPath,
      index: 1
    },
    balance: bigify('0')
  },
  {
    address: '0xE8E0F5417B272f2a1C24419bd2cF6B3F584c6b9A' as TAddress,
    pathItem: {
      path: "m/44'/60'/0'/5",
      baseDPath: {
        label: 'Ledger (ETH)',
        value: "m/44'/60'/0'",
        offset: 0,
        numOfAddresses: 5
      } as ExtendedDPath,
      index: 1
    },
    balance: bigify('12000000000000000000')
  }
];

export const fAccount: StoreAccount = fAccounts[1];
