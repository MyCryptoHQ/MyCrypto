import BigNumber from 'bignumber.js';

export const bnify = (v: string | number | BigNumber) => new BigNumber(v);

export type TBN = BigNumber;
