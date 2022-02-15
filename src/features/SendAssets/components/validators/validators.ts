import { isHexPrefixed } from 'ethjs-util';
import { TestOptions } from 'yup';

import { DEFAULT_ASSET_DECIMAL } from '@config';
import {
  gasLimitValidator,
  gasPriceValidator,
  isValidHex,
  isValidPositiveNumber
} from '@services/EthService';
import { isValidPositiveOrZeroInteger } from '@services/EthService/validators';
import { translateRaw } from '@translations';
import { Asset, IFormikFields } from '@types';
import { bigify, gasStringsToMaxGasBN, toWei } from '@utils';

export function validateGasPriceField(): TestOptions {
  return {
    message: translateRaw('ERROR_10'),
    test: (value) => gasPriceValidator(value)
  };
}

export function validateGasLimitField(): TestOptions {
  return {
    message: translateRaw('ERROR_8'),
    test: (value) => gasLimitValidator(value)
  };
}

export function validateDataField(): TestOptions {
  return {
    message: translateRaw('ERROR_9'),
    test: (value) => {
      if (value === '' || value === undefined) {
        return true;
      }
      return isValidHex(value) && isHexPrefixed(value);
    }
  };
}

export function validateNonceField(): TestOptions {
  return {
    message: translateRaw('ERROR_11'),
    test: (value) => isValidPositiveOrZeroInteger(value)
  };
}

export function validateAmountField(): TestOptions {
  return {
    message: translateRaw('ERROR_0'),
    test: (value) => isValidPositiveNumber(value)
  };
}

export const canAffordTX = (
  baseAsset: Asset,
  { account, asset, gasLimitField, amount }: IFormikFields,
  gasPrice: string
) => {
  const gasLimit = gasLimitField;
  const gasTotal = bigify(gasStringsToMaxGasBN(gasPrice, gasLimit).toString());
  const total =
    asset.type === 'base'
      ? gasTotal.plus(bigify(toWei(amount, baseAsset.decimal ?? DEFAULT_ASSET_DECIMAL).toString()))
      : gasTotal;
  const storeBaseAsset = account.assets && account.assets.find((a) => a.uuid === baseAsset.uuid);
  return storeBaseAsset ? total.lte(bigify(storeBaseAsset.balance)) : false;
};
