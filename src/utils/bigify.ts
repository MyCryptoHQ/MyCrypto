import { BigNumber as BigNumberish } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';

import { DEFAULT_ASSET_DECIMAL } from '@config';
import { BigifySupported } from '@types';

export const bigify = (v: BigifySupported): BigNumber => {
  BigNumber.config({ DECIMAL_PLACES: DEFAULT_ASSET_DECIMAL, EXPONENTIAL_AT: 1e9 });
  if (BigNumberish.isBigNumber(v) && 'toHexString' in v) {
    return new BigNumber(v.toHexString());
  } else if (BN.isBN(v)) {
    return new BigNumber(v.toString('hex'));
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

export const hasBalance = (
  balance: BigNumber.Value | BigNumber | BigNumberish | bigint | BN | undefined
) => (balance ? !bigify(balance).isZero() : false);
