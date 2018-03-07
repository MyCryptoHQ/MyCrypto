declare module 'ethereumjs-abi' {
  import BN from 'bn.js';
  type Values = (string | number | BN)[];
  type Types = string[];
  export function eventID(name: string, types: Types): Buffer;
  export function methodID(name: string, types: Types): Buffer;
  export function rawEncode(types: Types, values: Values): Buffer;
  export function rawDecode(
    types: Types,
    data: string | Buffer
  ): (Buffer | boolean | number | BN | string)[];
  export function simpleEncode(method: string, values: Values): Buffer;
  export function simpleDecode(
    method: string,
    data: string | Buffer
  ): (Buffer | boolean | number | BN | string)[];
  export function stringify(types: Types, values: Values): string;
  export function solidityPack(types: Types, values: Values): Buffer;
  export function soliditySHA3(types: Types, values: Values): Buffer;
  export function soliditySHA256(types: Types, values: Values): Buffer;
  export function solidityRIPEMD160(types: Types, values: Values): Buffer;
  export function fromSerpent(sig: string): Types;
  export function toSerpent(types: Types): string;
}
