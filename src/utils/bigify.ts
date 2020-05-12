import BigNumber from 'bignumber.js';

export const bigify = (v: string): BigNumber => new BigNumber(v);
