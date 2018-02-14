import { Wei, toTokenBase } from 'libs/units';
import { addHexPrefix } from 'ethereumjs-util';
import { AppState } from 'reducers';

export function stripHexPrefix(value: string) {
  return value.replace('0x', '');
}

export function stripHexPrefixAndLower(value: string): string {
  return stripHexPrefix(value).toLowerCase();
}

export function toHexWei(weiString: string): string {
  return addHexPrefix(Wei(weiString).toString(16));
}

export function padLeftEven(hex: string) {
  return hex.length % 2 !== 0 ? `0${hex}` : hex;
}

export function sanitizeHex(hex: string) {
  const hexStr = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
  return hex !== '' ? `0x${padLeftEven(hexStr)}` : '';
}

export const buildEIP681EtherRequest = (
  recipientAddr: string,
  chainId: number,
  etherValue: AppState['transaction']['fields']['value']
) => `ethereum:${recipientAddr}${chainId !== 1 ? `@${chainId}` : ''}?value=${etherValue.raw}e18`;

export const buildEIP681TokenRequest = (
  recipientAddr: string,
  contractAddr: string,
  chainId: number,
  tokenValue: AppState['transaction']['meta']['tokenTo'],
  decimal: number,
  gasLimit: AppState['transaction']['fields']['gasLimit']
) =>
  `ethereum:${contractAddr}${
    chainId !== 1 ? `@${chainId}` : ''
  }/transfer?address=${recipientAddr}&uint256=${toTokenBase(tokenValue.raw, decimal)}&gas=${
    gasLimit.raw
  }`;

export const sanitizeNumericalInput = (input: string): string => {
  const inputFloat = parseFloat(input);

  if (!input || isNaN(inputFloat)) {
    return input;
  }

  // limit input field decrement to 0
  if (inputFloat === -1) {
    return '0';
  }

  // convert negative values to positive
  return Math.abs(inputFloat).toString();
};
