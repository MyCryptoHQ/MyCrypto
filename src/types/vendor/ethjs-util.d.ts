declare module 'ethjs-util' {
  export function arrayContainsArray(arrayA: any[], arrayB: any[]): boolean;
  export function getBinarySize(num: string): number;
  export function intToBuffer(integer: number): Buffer;
  export function isHexPrefixed(hex: string): boolean;
  export function stripHexPrefix(hexWithPrefix: string): string;
  export function padToEven(unpaddedNumber: string): string;
  export function intToHex(integer: number): string;
  export function fromAscii(ascii: string): string;
  export function fromUtf8(utf8: string): string;
  export function toAscii(nonAscii: string): string;
  export function toUtf8(nonUtf8: string): string;
  export function getKeys(keys: any[], query: string): any[];
  export function isHexString(inputString: string): boolean;
}
