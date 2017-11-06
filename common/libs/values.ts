import { Wei } from 'libs/units';
export function stripHexPrefix(value: string) {
  return value.replace('0x', '');
}

export function stripHexPrefixAndLower(value: string): string {
  return stripHexPrefix(value).toLowerCase();
}

export function toHexWei(weiString: string): string {
  return `0x${Wei(weiString).toString(16)}`;
}

export function padLeftEven(hex: string) {
  return hex.length % 2 !== 0 ? `0${hex}` : hex;
}

// TODO: refactor to not mutate argument
export function sanitizeHex(hex: string) {
  hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
  if (hex === '') {
    return '';
  }
  return `0x${padLeftEven(hex)}`;
}
