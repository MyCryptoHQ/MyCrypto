import { isHexPrefixed } from 'ethjs-util';
import { TestOptions } from 'yup';

import {
  gasLimitValidator,
  gasPriceValidator,
  isValidHex,
  isValidPositiveNumber
} from '@services/EthService';
import { isValidPositiveOrZeroInteger } from '@services/EthService/validators';
import { translateRaw } from '@translations';

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
