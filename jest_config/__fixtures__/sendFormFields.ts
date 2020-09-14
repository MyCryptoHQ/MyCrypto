import { IFormikFields, IReceiverAddress } from '@types';
import { fAssets } from './assets';
import { fNetwork, fNetworks } from './network';
import { fAccounts } from './account';

export const fETHTxSendFormikFields: IFormikFields = {
  asset: fAssets[0],
  network: fNetwork,
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
  amount: '0.01'
};

export const fAdvancedETHTxSendFormikFields: IFormikFields = {
  asset: fAssets[0],
  network: fNetwork,
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
  amount: '0.01'
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
  amount: '0.01'
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
  amount: '0.01'
};
