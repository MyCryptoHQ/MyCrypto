import { ITxValue } from '@types';

export interface Response {
  success: boolean;
  claims: Record<string, Claim | null>;
}

export interface Claim {
  Index: number;
  Amount: ITxValue; // HEX
}
