import { BigNumber } from '@ethersproject/bignumber';

import {
  ITxConfig,
  ITxData,
  ITxFromAddress,
  ITxGasLimit,
  ITxGasPrice,
  ITxNonce,
  ITxToAddress,
  ITxValue,
  NetworkId,
  StoreAccount,
  TAddress,
  TAssetType,
  TTicker,
  TUuid
} from '@types';
import { isSameAddress } from '@utils';

import { fAccounts } from './account';
import { fAssets } from './assets';
import { fNetwork } from './network';

export const fERC20NonWeb3TxConfig: ITxConfig = {
  rawTransaction: {
    to: '0xad6d458402f60fd3bd25163575031acdce07538d' as ITxToAddress,
    value: '0x0' as ITxValue,
    data: '0xa9059cbb000000000000000000000000b2bb2b958AFa2e96dab3f3Ce7162b87daEa39017000000000000000000000000000000000000000000000000002386f26fc10000' as ITxData,
    gasLimit: '0x7d3c' as ITxGasLimit,
    gasPrice: '0x12a05f200' as ITxGasPrice,
    nonce: '0x7' as ITxNonce,
    chainId: 3
  },
  receiverAddress: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017' as TAddress,
  amount: '0.01',
  networkId: fNetwork.id,
  asset: {
    uuid: '2783a9ff-d6f1-5c9e-bbab-3b74be91adb1' as TUuid,
    name: 'RopDAI',
    decimal: 18,
    ticker: 'RopDAI' as TTicker,
    networkId: 'Ropsten',
    contractAddress: '0xad6d458402f60fd3bd25163575031acdce07538d',
    type: 'erc20',
    isCustom: true
  },
  baseAsset: {
    ticker: 'RopstenETH' as TTicker,
    name: 'Ropsten',
    decimal: 18,
    networkId: 'Ropsten',
    type: 'base',
    isCustom: false,
    uuid: '77de68da-ecd8-53ba-bbb5-8edb1c8e14d7' as TUuid
  },
  senderAccount: fAccounts.find(({ address }) =>
    isSameAddress('0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017' as TAddress, address)
  ) as StoreAccount,
  from: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017' as TAddress
};

export const fETHNonWeb3TxConfig: ITxConfig = {
  rawTransaction: {
    to: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017' as ITxToAddress,
    value: '0x2386f26fc10000' as ITxValue,
    data: '0x' as ITxData,
    gasLimit: '0x5208' as ITxGasLimit,
    gasPrice: '0x12a05f200' as ITxGasPrice,
    nonce: '0x6' as ITxNonce,
    chainId: 3
  },
  receiverAddress: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017' as TAddress,
  amount: '0.01',
  networkId: fNetwork.id,
  asset: {
    ticker: 'RopstenETH' as TTicker,
    name: 'Ropsten',
    decimal: 18,
    networkId: 'Ropsten',
    type: 'base',
    isCustom: false,
    uuid: '77de68da-ecd8-53ba-bbb5-8edb1c8e14d7' as TUuid
  },
  baseAsset: {
    ticker: 'RopstenETH' as TTicker,
    name: 'Ropsten',
    decimal: 18,
    networkId: 'Ropsten',
    type: 'base',
    isCustom: false,
    uuid: '77de68da-ecd8-53ba-bbb5-8edb1c8e14d7' as TUuid
  },
  senderAccount: fAccounts.find(({ address }) =>
    isSameAddress('0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017' as TAddress, address)
  ) as StoreAccount,
  from: '0xB2BB2b958aFA2e96dAb3F3Ce7162B87dAea39017' as TAddress
};

export const fApproveErc20TxConfig = {
  amount: '5',
  asset: {
    balance: BigNumber.from('0x3782dace9d900000'),
    contractAddress: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
    decimal: 18,
    isCustom: false,
    name: 'REPv1',
    networkId: 'Ethereum' as NetworkId,
    ticker: 'REPv1' as TTicker,
    type: 'erc20' as TAssetType,
    uuid: 'd017a1e8-bdd3-5c32-8866-da258f75b0e9' as TUuid
  },
  baseAsset: { ...fAssets[0], balance: BigNumber.from('0x1b9ced41465be000') },
  rawTransaction: {
    chainId: 1,
    data: '0x095ea7b3000000000000000000000000221657776846890989a759ba2973e427dff5c9bb0000000000000000000000000000000000000000000000004563918244f40000' as ITxData,
    from: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as ITxFromAddress,
    gasLimit: '0x249f0' as ITxGasLimit,
    gasPrice: '0x12a05f200' as ITxGasPrice,
    nonce: '0x1' as ITxNonce,
    to: '0x1985365e9f78359a9B6AD760e32412f4a445E862' as ITxToAddress,
    value: '0x0' as ITxValue
  },
  receiverAddress: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as TAddress,
  senderAccount: fAccounts[0],
  from: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as TAddress,
  networkId: 'Ethereum' as NetworkId
};

export const fTokenMigrationTxConfig = {
  amount: '5',
  asset: {
    balance: BigNumber.from('0x3782dace9d900000'),
    contractAddress: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
    decimal: 18,
    isCustom: false,

    name: 'REPv1',
    networkId: 'Ethereum',
    ticker: 'REPv1',
    type: 'erc20',
    uuid: 'd017a1e8-bdd3-5c32-8866-da258f75b0e9'
  },
  baseAsset: { ...fAssets[0], balance: BigNumber.from('0x1b9ced41465be000') },
  from: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c',
  rawTransaction: {
    chainId: 1,
    data: '0x75d9aa1a',
    from: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c',
    gasLimit: '0x249f0',
    gasPrice: '0x12a05f200',
    nonce: '0x1',
    to: '0x221657776846890989a759BA2973e427DfF5C9bB',
    value: '0x0'
  },
  receiverAddress: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c',
  senderAccount: fAccounts[0],
  networkId: 'Ethereum'
};
