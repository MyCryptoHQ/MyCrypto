import { isValidHex, gasPriceValidator, gasLimitValidator } from 'v2/libs/validators';

export function validateGasPriceField(value: string): string | undefined {
  if (!gasPriceValidator(value)) {
    return 'Gas price must be a valid number.';
  }
}

export function validateGasLimitField(value: string): string | undefined {
  if (!gasLimitValidator(value)) {
    return 'Gas limit must be a valid number.';
  }
}

export function validateDataField(value: string): string | undefined {
  if (!isValidHex(value)) {
    return 'Data field must contain valid hex.';
  }
}

export function validateNonceField(value: string): string | undefined {
  if (!(parseInt(value, 10) >= 0)) {
    return 'Nonce must be a valid number.';
  }
}
