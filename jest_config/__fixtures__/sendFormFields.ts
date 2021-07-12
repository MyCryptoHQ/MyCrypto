import { IFormikFields, IReceiverAddress } from '@types';

import { fAccounts } from './account';
import { fAssets } from './assets';
import { fNetwork, fNetworks } from './network';

const nonEIP1559Network = { ...fNetwork, supportsEIP1559: false };

export const fETHTxSendFormikFields: IFormikFields = {
  asset: fAssets[0],
  network: nonEIP1559Network,
  account: fAccounts[0],
  txDataField: '0x',
  gasEstimates: {
    safeLow: 50,
    standard: 65,
    fast: 70,
    fastest: 150,
    time: 1590450314,
    chainId: 1,
    isDefault: false
  },
  gasPriceField: '65',
  gasPriceSlider: '65',
  gasLimitField: '21000',
  nonceField: '1',
  advancedTransaction: false,
  isAutoGasSet: true,
  address: {
    display: fAccounts[0].label,
    value: fAccounts[0].address
  } as IReceiverAddress,
  amount: '0.01',
  maxFeePerGasField: '20',
  maxPriorityFeePerGasField: '1'
};

export const fAdvancedETHTxSendFormikFields: IFormikFields = {
  asset: fAssets[0],
  network: nonEIP1559Network,
  account: fAccounts[0],
  txDataField: '0x',
  gasEstimates: {
    safeLow: 50,
    standard: 65,
    fast: 70,
    fastest: 150,
    time: 1590450314,
    chainId: 1,
    isDefault: false
  },
  gasPriceField: '69',
  gasPriceSlider: '65',
  gasLimitField: '21000',
  nonceField: '1',
  advancedTransaction: true,
  isAutoGasSet: true,
  address: {
    display: fAccounts[0].label,
    value: fAccounts[0].address
  } as IReceiverAddress,
  amount: '0.01',
  maxFeePerGasField: '20',
  maxPriorityFeePerGasField: '1'
};

export const fERC20TxSendFormikFields: IFormikFields = {
  asset: fAssets[fAssets.length - 1],
  network: fNetworks[1],
  account: fAccounts[1],
  txDataField: '0x',
  gasEstimates: {
    safeLow: 50,
    standard: 65,
    fast: 70,
    fastest: 150,
    time: 1590450314,
    chainId: 3,
    isDefault: false
  },
  gasPriceField: '65',
  gasPriceSlider: '65',
  gasLimitField: '35000',
  nonceField: '1',
  advancedTransaction: false,
  isAutoGasSet: true,
  address: {
    display: fAccounts[1].label,
    value: fAccounts[1].address
  } as IReceiverAddress,
  amount: '0.01',
  maxFeePerGasField: '20',
  maxPriorityFeePerGasField: '1'
};

export const fAdvancedERC20TxSendFormikFields: IFormikFields = {
  asset: fAssets[fAssets.length - 1],
  network: fNetworks[1],
  account: fAccounts[1],
  txDataField: '0x',
  gasEstimates: {
    safeLow: 50,
    standard: 65,
    fast: 70,
    fastest: 150,
    time: 1590450314,
    chainId: 3,
    isDefault: false
  },
  gasPriceField: '69',
  gasPriceSlider: '65',
  gasLimitField: '35000',
  nonceField: '1',
  advancedTransaction: true,
  isAutoGasSet: true,
  address: {
    display: fAccounts[1].label,
    value: fAccounts[1].address
  } as IReceiverAddress,
  amount: '0.01',
  maxFeePerGasField: '20',
  maxPriorityFeePerGasField: '1'
};

export const fETHTxSendFormikFieldsEIP1559: IFormikFields = {
  asset: fAssets[1],
  network: { ...fNetwork, supportsEIP1559: true },
  account: fAccounts[0],
  txDataField: '0x',
  gasEstimates: {
    safeLow: 50,
    standard: 65,
    fast: 70,
    fastest: 150,
    time: 1590450314,
    chainId: 1,
    isDefault: false
  },
  gasPriceField: '65',
  gasPriceSlider: '65',
  gasLimitField: '21000',
  nonceField: '1',
  advancedTransaction: false,
  isAutoGasSet: true,
  address: {
    display: fAccounts[0].label,
    value: fAccounts[0].address
  } as IReceiverAddress,
  amount: '0.01',
  maxFeePerGasField: '20',
  maxPriorityFeePerGasField: '1'
};
