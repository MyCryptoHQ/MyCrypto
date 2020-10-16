declare module 'rskjs-util' {
  /**
   *
   * @description Returns a checksummed address
   * @export
   * @param {string} address
   * @returns {string}
   */
  export function toChecksumAddress(address: string, chainId: number): string;

  /**
   *
   * @description Checks if the address is a valid checksummed address
   * @export
   * @param {string} address
   * @returns {boolean}
   */
  export function isValidChecksumAddress(address: string, chainId: number): boolean;
}
