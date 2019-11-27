import { Wei } from 'libs/units';
import { addHexPrefix } from 'ethereumjs-util';

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

export const sanitizeNumericalInput = (input: string): string => {
  const inputFloat = Number(input);

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
