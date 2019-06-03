import { isValidHex, gasPriceValidator, gasLimitValidator } from 'v2/libs/validators';

export function validateGasPriceField(value: string): string | undefined {
  let error;
  if (!gasPriceValidator(value)) {
    error = 'Gas price must be a valid number.';
  }
  return error;
}

export function validateGasLimitField(value: string): string | undefined {
  let error;
  if (!gasLimitValidator(value)) {
    error = 'Gas limit must be a valid number.';
  }
  return error;
}

export function validateDataField(value: string): string | undefined {
  let error;
  if (!isValidHex(value)) {
    error = 'Data field must contain valid hex.';
  }
  return error;
}

export function validateNonceField(value: string): string | undefined {
  let error;
  if (!(parseInt(value, 10) >= 0)) {
    error = 'Nonce must be a valid number.';
  }
  return error;
}
