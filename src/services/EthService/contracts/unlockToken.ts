import { IUNLOCKLOCK } from '@types';

import { default as Contract } from './contract';
import { UnlockABI } from './unlockAbi';

export const UnlockToken = (new Contract(UnlockABI, {
  decimals: ['decimals'],
  symbol: ['symbol'],
  approve: ['approved']
}) as any) as IUNLOCKLOCK;
