import { ITxHash, ITxSigned } from '@types';

export function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

// aka: Uint8Array[248, 169, 2, 133, ...]
export const isTxSigned = (walletResponse: any): walletResponse is ITxSigned =>
  !!walletResponse._isBuffer;

// aka: 0x9be781b4def0b764252ff6257a60129eea006b1dc9f657d715599ecff82e955f
export const isTxHash = (walletResponse: any): walletResponse is ITxHash =>
  typeof walletResponse === 'string';
