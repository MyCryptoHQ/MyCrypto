import { isHexPrefixed } from 'ethjs-util';
import {
  isValidHex,
  gasPriceValidator,
  gasLimitValidator,
  isValidPositiveNumber
} from '@services/EthService';
import { translateRaw } from '@translations';
import { isValidPositiveOrZeroInteger } from '@services/EthService/validators';

export function validateGasPriceField(value: string): string | undefined {
  if (!gasPriceValidator(value)) {
    return translateRaw('ERROR_10');
  }
}

export function validateGasLimitField(value: string): string | undefined {
  if (!gasLimitValidator(value)) {
    return translateRaw('ERROR_8');
  }
}

export function validateDataField(value: string): string | undefined {
  if (!isValidHex(value) || !isHexPrefixed(value)) {
    return translateRaw('ERROR_9');
  }
}

export function validateNonceField(value: string): string | undefined {
  if (!isValidPositiveOrZeroInteger(value)) {
    return translateRaw('ERROR_11');
  }
}

export function validateAmountField(value: string): string | undefined {
  if (!isValidPositiveNumber(value)) {
    return translateRaw('ERROR_0');
  }
}
