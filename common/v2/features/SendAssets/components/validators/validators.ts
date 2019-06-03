export function validateGasPriceField(value: string): boolean {
  const valid = parseInt(value, 10) >= 0 && parseInt(value, 10) <= 3000;
  return valid;
}

export function validateGasLimitField(value: string): boolean {
  const valid = parseInt(value, 10) >= 0 && parseInt(value, 10) <= 8000000;
  return valid;
}

export function validateDataField(value: string): boolean {
  const valid = true;
  console.log(value);
  return valid;
}

export function validateNonceField(value: string): boolean {
  const valid = parseInt(value, 10) >= 0;
  return valid;
}
