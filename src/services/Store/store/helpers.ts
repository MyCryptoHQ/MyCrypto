import { ExtendedNotification, IAccount, StoreAccount } from '@types';
import { bigify, isBigish } from '@utils/bigify';
import { identity, ifElse, lensPath, lensProp, map, over, pipe, toString } from '@vendor';

const balanceLens = lensProp('balance');
const txValueLens = lensProp('value');
const assetLens = lensProp('assets');
const dateDisplayedLens = lensProp('dateDisplayed');
const dateDismissedLens = lensProp('dateDismissed');
const firstDashboardVisitDateLens = lensPath(['templateData', 'firstDashboardVisitDate']);

export const stringifyBalance = over(balanceLens, ifElse(isBigish, toString, identity));
export const stringifyValue = over(txValueLens, toString);
export const bigifyBalance = over(balanceLens, bigify);

export const serializeAccount: (a: IAccount | StoreAccount) => IAccount | StoreAccount = pipe(
  over(assetLens, map(stringifyBalance))
);

export const serializeNotification: (n: ExtendedNotification) => ExtendedNotification = (n) => {
  return pipe(
    over(dateDisplayedLens, toString),
    over(dateDismissedLens, toString),
    over(firstDashboardVisitDateLens, toString)
  )(n);
};
