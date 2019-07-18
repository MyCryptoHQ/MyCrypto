import AddressValidator from 'wallet-address-validator';

import { SHAPESHIFT_ASSET_WHITELIST } from 'v2/services/ShapeShift/constants';

interface ValidatorHash {
  [asset: string]: (address: string) => boolean;
}

export const isValidAddress = (address: string, ticker: string) =>
  (AddressValidator as any).validate(address, ticker);

export const isValidEthereumAddress = (address: string): boolean => isValidAddress(address, 'ETH');

export const isValidBitcoinAddress = (address: string): boolean => isValidAddress(address, 'BTC');

export const isValidMoneroAddress = (address: string): boolean => isValidAddress(address, 'XMR');

export const validNumber = (num: number) => isFinite(num) && num >= 0;
export const numberIsNotNegative = (num: number) => validNumber(num) && Math.sign(num) !== -1;

export const validDecimal = (input: string, decimal: number) => {
  const arr = input.split('.');

  // Only a single decimal can exist.
  if (arr.length > 2) {
    return false;
  }

  const fractionPortion = arr[1];

  if (!fractionPortion || fractionPortion.length === 0) {
    return true;
  }

  const decimalLength = fractionPortion.length;

  return decimalLength <= decimal;
};

export const isValidAmount = (decimal: number) => (amount: string) =>
  numberIsNotNegative(+amount) && validDecimal(amount, decimal);

export const addressValidatorHash: ValidatorHash = {
  ETH: isValidEthereumAddress,
  BTC: isValidBitcoinAddress,
  XMR: isValidMoneroAddress,
  ...SHAPESHIFT_ASSET_WHITELIST.reduce((prev: ValidatorHash, next) => {
    prev[next] = isValidEthereumAddress;
    return prev;
  }, {})
};
