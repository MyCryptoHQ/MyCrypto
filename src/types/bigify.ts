import { BigNumber as BigNumberish } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';
import BN from 'bn.js';

export type Bigish = BigNumber;
export type BigifySupported = BigNumber.Value | BigNumber | BigNumberish | bigint | BN;
