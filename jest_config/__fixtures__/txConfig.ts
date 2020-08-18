import { isSameAddress } from '@utils';
import { TAddress } from '@types';

import { fAccounts } from './account';
import { fNetwork } from './network';

export const fERC20NonWeb3TxConfig = {
  rawTransaction: {
    to: '0xad6d458402f60fd3bd25163575031acdce07538d',
    value: '0x0',
    data:
      '0xa9059cbb000000000000000000000000b2bb2b958AFa2e96dab3f3Ce7162b87daEa39017000000000000000000000000000000000000000000000000002386f26fc10000',
    gasLimit: '0x7d3c',
    gasPrice: '0x12a05f200',
    nonce: '0x7',
    chainId: 3
  },
  receiverAddress: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
  amount: '0.01',
  network: fNetwork,
  value: '0',
  asset: {
    uuid: '2783a9ff-d6f1-5c9e-bbab-3b74be91adb1',
    name: 'RopDAI',
    decimal: 18,
    ticker: 'RopDAI',
    networkId: 'Ropsten',
    mappings: {},
    contractAddress: '0xad6d458402f60fd3bd25163575031acdce07538d',
    type: 'erc20',
    isCustom: true
  },
  baseAsset: {
    ticker: 'RopstenETH',
    name: 'Ropsten',
    decimal: 18,
    networkId: 'Ropsten',
    type: 'base',
    mappings: {},
    isCustom: false,
    uuid: '77de68da-ecd8-53ba-bbb5-8edb1c8e14d7'
  },
  senderAccount: fAccounts.find(({ address }) =>
    isSameAddress('0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017' as TAddress, address)
  ),
  gasPrice: '5000000000',
  gasLimit: '32060',
  data:
    '0xa9059cbb000000000000000000000000b2bb2b958AFa2e96dab3f3Ce7162b87daEa39017000000000000000000000000000000000000000000000000002386f26fc10000',
  nonce: '7',
  from: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017'
};

export const fETHNonWeb3TxConfig = {
  rawTransaction: {
    to: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
    value: '0x2386f26fc10000',
    data: '0x',
    gasLimit: '0x5208',
    gasPrice: '0x12a05f200',
    nonce: '0x6',
    chainId: 3
  },
  receiverAddress: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017',
  amount: '0.01',
  network: fNetwork,
  value: '10000000000000000',
  asset: {
    ticker: 'RopstenETH',
    name: 'Ropsten',
    decimal: 18,
    networkId: 'Ropsten',
    type: 'base',
    mappings: {},
    isCustom: false,
    uuid: '77de68da-ecd8-53ba-bbb5-8edb1c8e14d7'
  },
  baseAsset: {
    ticker: 'RopstenETH',
    name: 'Ropsten',
    decimal: 18,
    networkId: 'Ropsten',
    type: 'base',
    mappings: {},
    isCustom: false,
    uuid: '77de68da-ecd8-53ba-bbb5-8edb1c8e14d7'
  },
  senderAccount: fAccounts.find(({ address }) =>
    isSameAddress('0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017' as TAddress, address)
  ),
  gasPrice: '5000000000',
  gasLimit: '21000',
  data: '0x',
  nonce: '6',
  from: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017'
};
