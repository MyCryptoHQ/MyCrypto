import {
  isValidHex,
  gasPriceValidator,
  gasLimitValidator,
  isValidAmount
} from 'v2/libs/validators';
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
  if (!isValidHex(value)) {
    return translateRaw('ERROR_9');
  }
}

export function validateNonceField(value: string): string | undefined {
  if (!(parseInt(value, 10) >= 0)) {
    return translateRaw('ERROR_11');
  }
}

export function validateAmountField(value: string): string | undefined {
  if (!isValidAmount(parseFloat(value))) {
    return translateRaw('ERROR_0');
  }
}
