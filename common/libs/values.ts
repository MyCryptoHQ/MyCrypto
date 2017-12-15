import { Wei } from 'libs/units';
import { addHexPrefix } from 'ethereumjs-util';
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

export function networkIdToName(networkId: string | number): string {
  switch (networkId.toString()) {
    case '1':
      return 'ETH';
    case '3':
      return 'Ropsten';
    case '4':
      return 'Rinkeby';
    case '42':
      return 'Kovan';
    default:
      throw new Error(`Network ${networkId} is unsupported.`);
  }
}
