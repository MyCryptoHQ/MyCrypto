import { StoreAccount } from '@types';
import { bigify, isBigish } from '@utils/bigify';
import { identity, ifElse, lensProp, map, over, pipe, toString } from '@vendor';

const balanceLens = lensProp('balance');
const txValueLens = lensProp('value');
const txsLens = lensProp('transactions');
const assetLens = lensProp('assets');

export const stringifyBalance = over(balanceLens, ifElse(isBigish, toString, identity));
export const stringifyValue = over(txValueLens, toString);
export const bigifyBalance = over(balanceLens, bigify);

export const serializeAccount: (a: StoreAccount) => StoreAccount = pipe(
  over(assetLens, map(stringifyBalance)),
  over(txsLens, map(stringifyBalance))
);
