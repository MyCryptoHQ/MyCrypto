import { TestOptions } from 'yup';
import { isHexPrefixed } from 'ethjs-util';
import {
  isValidHex,
  gasPriceValidator,
  gasLimitValidator,
  isValidPositiveNumber
} from '@services/EthService';
import { translateRaw } from '@translations';
import { isValidPositiveOrZeroInteger } from '@services/EthService/validators';

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
    test: (value) => value !== '' && isValidHex(value) && isHexPrefixed(value)
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
