import { isHexPrefixed } from 'ethjs-util';
import {
  isValidHex,
  gasPriceValidator,
  gasLimitValidator,
  isValidPositiveNumber,
  isValidNonZeroInteger
} from 'v2/services/EthService';
import { translateRaw } from 'translations';

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
  if (!isValidNonZeroInteger(value)) {
    return translateRaw('ERROR_11');
  }
}

export function validateAmountField(value: string): string | undefined {
  if (!isValidPositiveNumber(value)) {
    return translateRaw('ERROR_0');
  }
}
