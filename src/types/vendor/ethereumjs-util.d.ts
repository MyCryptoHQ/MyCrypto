declare module 'ethereumjs-util' {
  import BN from 'bn.js';
  import { Buffer } from 'buffer';

  export { default as rlp } from 'rlp';
  export * from 'ethjs-util';
  //@todo: missing types for secp256k1, defineProperties, isZeroAddress, ethjs-util package
  interface Signature {
    v: number;
    r: Buffer;
    s: Buffer;
  }

  export const MAX_INTEGER: BN;

  export const TWO_POW256: BN;

  /**
   *
   * @description Returns a buffer filled with 0s
   * @export
   * @param {number} bytes the number of bytes the buffer should be
   * @returns {Buffer}
   */
  export function zeros(bytes: number): Buffer;

  /**
   *
   * @description
   * @export
   * @param {Buffer} msg the value to pad
   * @param {number} length the number of bytes the output should be
   * @param {boolean} right whether to start padding form the left or right (optional, default false)
   * @returns {Buffer}
   */

  export function setLength(msg: Buffer, length: number, right: boolean): Buffer;

  /**
   *
   * @description
   * @export
   * @param {number[]} msg the value to pad
   * @param {number} length the number of bytes the output should be
   * @param {boolean} right whether to start padding form the left or right (optional, default false)
   * @returns {number[]}
   */
  export function setLength(msg: number[], length: number, right: boolean): number[];

  /**
   *
   * @description Left Pads an Array or Buffer with leading zeros till it has length bytes. Or it truncates the beginning if it exceeds.
   * @export
   * @param {Buffer} msg the value to pad
   * @param {number} length the number of bytes the output should be
   * @param {boolean} right whether to start padding form the left or right (optional, default false)
   * @returns {Buffer}
   */
  export function setLengthLeft(msg: Buffer, length: number, right: boolean): Buffer;

  /**
   *
   * @description
   * @export
   * @param {number[]} msg he value to pad
   * @param {number} length the number of bytes the output should be
   * @param {boolean} right  whether to start padding form the left or right (optional, default false)
   * @returns {number[]}
   */
  export function setLengthLeft(msg: number[], length: number, right: boolean): number[];

  /**
   *
   * @description Right Pads an Array or Buffer with leading zeros till it has length bytes. Or it truncates the beginning if it exceeds.
   * @export
   * @param {Buffer} msg the value to pad
   * @param {number} length the number of bytes the output should be
   * @returns {Buffer}
   */
  export function setLengthRight(msg: Buffer, length: number): Buffer;

  /**
   *
   * @description Right Pads an Array or Buffer with leading zeros till it has length bytes. Or it truncates the beginning if it exceeds.
   * @export
   * @param {number[]} msg the value to pad
   * @param {number} length the number of bytes the output should be
   * @returns {number[]}
   */
  export function setLengthRight(msg: number[], length: number): number[];

  /**
   *
   * @description Trims leading zeros from a Buffer or an Array
   * @export
   * @param {Buffer} a
   * @returns {Buffer}
   */
  export function unpad(a: Buffer): Buffer;

  /**
   *
   * @description Trims leading zeros from a Buffer or an Array
   * @export
   * @param {number[]} a
   * @returns {number[]}
   */
  export function unpad(a: number[]): number[];

  /**
   *
   * @description Trims leading zeros from a Buffer or an Array
   * @export
   * @param {string} a
   * @returns {string}
   */
  export function unpad(a: string): string;

  /**
   *
   * @description Attempts to turn a value into a Buffer. As input it supports Buffer, String, Number, null/undefined, BN and other objects with a toArray() method.
   * @export
   * @param {*} v the value
   * @returns {Buffer}
   */
  export function toBuffer(v: any): Buffer;

  /**
   *
   * @description Converts a Buffer to a Number
   * @export
   * @param {(Buffer | BN)} buf
   * @returns {number}
   */
  export function bufferToInt(buf: Buffer | BN): number;

  /**
   *
   * @description Converts a Buffer into a hex String
   * @export
   * @param {(Buffer | BN)} buf
   * @returns {string}
   */
  export function bufferToHex(buf: Buffer | BN): string;

  /**
   *
   * @description Interprets a Buffer as a signed integer and returns a BN. Assumes 256-bit numbers.
   * @export
   * @param {(Buffer | BN)} num
   * @returns {BN}
   */
  export function fromSigned(num: Buffer | BN): BN;

  /**
   *
   * @description Converts a BN to an unsigned integer and returns it as a Buffer. Assumes 256-bit numbers.
   * @export
   * @param {BN} num
   * @returns {Buffer}
   */
  export function toUnsigned(num: BN): Buffer;

  /**
   *
   * @description Creates Keccak hash of the input
   * @export
   * @param {(Buffer | string | number | number[])} a the input data
   * @param {number} [bits] the SHA width (optional, default 256)
   * @returns {Buffer}
   */
  export function keccak(a: Buffer | string | number | number[], bits?: number): Buffer;

  /**
   *
   * @description Creates SHA256 hash of the input
   * @export
   * @param {(Buffer | string | number | number[])} a the input data
   * @returns {Buffer}
   */
  export function sha256(a: Buffer | string | number | number[]): Buffer;

  /**
   *
   * @description Creates RIPEMD160 hash of the input
   * @export
   * @param {(Buffer | string | number | number[])} a  the input data
   * @param {boolean} [padded] whether it should be padded to 256 bits or not
   * @returns {Buffer}
   */
  export function ripemd160(a: Buffer | string | number | number[], padded?: boolean): Buffer;

  /**
   *
   * @description Creates SHA-3 hash of the RLP encoded version of the input
   * @export
   * @param {(Buffer | string | number | number[])} a the input data
   * @returns {Buffer}
   */
  export function rlphash(a: Buffer | string | number | number[]): Buffer;

  /**
   *
   * @description Checks if the private key satisfies the rules of the curve secp256k1.
   * @export
   * @param {Buffer} privateKey
   * @returns {boolean}
   */
  export function isValidPrivate(privateKey: Buffer): boolean;

  /**
   *
   * @description Checks if the public key satisfies the rules of the curve secp256k1 and the requirements of Ethereum.
   * @export
   * @param {Buffer} publicKey The two points of an uncompressed key, unless sanitize is enabled
   * @param {boolean} [sanitize] Accept public keys in other formats (optional, default false)
   * @returns {boolean}
   */
  export function isValidPublic(publicKey: Buffer, sanitize?: boolean): boolean;

  /**
   *
   * @description Returns the ethereum address of a given public key. Accepts "Ethereum public keys" and SEC1 encoded keys.
   * @export
   * @param {Buffer} publicKey The two points of an uncompressed key, unless sanitize is enabled
   * @param {boolean} [sanitize] Accept public keys in other formats (optional, default false)
   * @returns {Buffer}
   */
  export function pubToAddress(publicKey: Buffer, sanitize?: boolean): Buffer;

  /**
   *
   * @description Returns the ethereum address of a given public key. Accepts "Ethereum public keys" and SEC1 encoded keys.
   * @export
   * @param {Buffer} publicKey The two points of an uncompressed key, unless sanitize is enabled
   * @param {boolean} [sanitize] Accept public keys in other formats (optional, default false)
   * @returns {Buffer}
   */
  export function publicToAddress(publicKey: Buffer, sanitize?: boolean): Buffer;

  /**
   *
   * @description the max integer that this VM can handle (a BN)
   * @export
   * @param {Buffer} privateKey
   * @returns {Buffer}
   */
  export function privateToPublic(privateKey: Buffer): Buffer;

  /**
   *
   * @description Converts a public key to the Ethereum format.
   * @export
   * @param {Buffer} publicKey
   * @returns {Buffer}
   */
  export function importPublic(publicKey: Buffer): Buffer;

  /**
   *
   * @description ECDSA sign
   * @export
   * @param {Buffer} message
   * @param {Buffer} privateKey
   * @returns {Signature}
   */
  export function ecsign(message: Buffer, privateKey: Buffer): Signature;

  /**
   *
   * @description Returns the keccak-256 hash of message, prefixed with the header used by the eth_sign RPC call. The output of this function can be fed into ecsign to produce the same signature as the eth_sign call for a given message, or fed to ecrecover along with a signature to recover the public key used to produce the signature.
   * @export
   * @param {(Buffer | string)} message
   * @returns {Buffer}
   */
  export function hashPersonalMessage(message: Buffer | string): Buffer;

  /**
   *
   * @description ECDSA public key recovery from signature
   * @export
   * @param {Buffer} msgHash
   * @param {number} v
   * @param {Buffer} r
   * @param {Buffer} s
   * @returns {Buffer}
   */
  export function ecrecover(msgHash: Buffer, v: number, r: Buffer, s: Buffer): Buffer;

  /**
   *
   * @description Convert signature parameters into the format of eth_sign RPC method
   * @export
   * @param {number} v
   * @param {Buffer} r
   * @param {Buffer} s
   * @returns {string}
   */
  export function toRpcSig(v: number, r: Buffer, s: Buffer): string;

  /**
   *
   * @description Convert signature format of the eth_sign RPC method to signature parameters NOTE: all because of a bug in geth: https://github.com/ethereum/go-ethereum/issues/2053
   * @export
   * @param {string} sig
   * @returns {Signature}
   */
  export function fromRpcSig(sig: string): Signature;

  /**
   *
   * @description Returns the ethereum address of a given private key
   * @export
   * @param {Buffer} privateKey A private key must be 256 bits wide
   * @returns {Buffer}
   */
  export function privateToAddress(privateKey: Buffer): Buffer;

  /**
   *
   * @description Checks if the address is a valid. Accepts checksummed addresses too
   * @export
   * @param {string} address
   * @returns {boolean}
   */
  export function isValidAddress(address: string): boolean;

  /**
   *
   * @description Returns a checksummed address
   * @export
   * @param {string} address
   * @returns {string}
   */
  export function toChecksumAddress(address: string): string;

  /**
   *
   * @description Checks if the address is a valid checksummed address
   * @export
   * @param {string} address
   * @returns {boolean}
   */
  export function isValidChecksumAddress(address: string): boolean;

  /**
   *
   * @description Generates an address of a newly created contract
   * @export
   * @param {(Buffer | string)} from the address which is creating this new address
   * @param {(number | string | number[] | Buffer)} nonce the nonce of the from account
   * @returns {Buffer}
   */
  export function generateAddress(
    from: Buffer | string,
    nonce: number | string | number[] | Buffer
  ): Buffer;

  /**
   *
   * @description Returns true if the supplied address belongs to a precompiled account
   * @export
   * @param {(Buffer | string)} address
   * @returns {boolean}
   */
  export function isPrecompiled(address: Buffer | string): boolean;

  /**
   *
   * @description Adds "0x" to a given String if it does not already start with "0x"
   * @export
   * @param {string} str
   * @returns {string}
   */
  export function addHexPrefix(str: string): string;

  /**
   *
   * @description Validate ECDSA signature
   * @export
   * @param {number} v
   * @param {(Buffer | string)} r
   * @param {(Buffer | string)} s
   * @param {boolean} [homestead]  (optional, default true)
   * @returns {boolean}
   */
  export function isValidSignature(
    v: number,
    r: Buffer | string,
    s: Buffer | string,
    homestead?: boolean
  ): boolean;

  /**
   *
   * @description Converts a Buffer or Array to JSON
   * @export
   * @param {(Buffer | any[])} ba
   * @returns {string}
   */
  export function baToJSON(ba: Buffer | any[]): string;
}
