import BigNumber from 'bignumber.js';
import BN from 'bn.js';
import { BigNumber as BigNumberish } from 'ethers/utils';

export type Bigish = BigNumber;

export const bigify = (v: BigNumber.Value | BigNumber | BigNumberish | bigint): BigNumber => {
  if (BigNumberish.isBigNumber(v)) {
    return new BigNumber(v.toString());
  } else if (typeof v === 'object' && '_hex' in v) {
    return new BigNumber(v._hex);
  } else if (typeof v === 'bigint') {
    return new BigNumber(v.toString(16), 16);
  } else {
    return new BigNumber(v);
  }
};

export const isBigish = (v: any): boolean => {
  if (BN.isBN(v)) {
    return true;
  } else if (BigNumber.isBigNumber(v)) {
    return true;
  } else if (BigNumberish.isBigNumber(v)) {
    return true;
  } else {
    return false;
  }
};
