import BigNumber from 'bignumber.js';

export const bigify = (v: BigNumber.Value): BigNumber => new BigNumber(v);
