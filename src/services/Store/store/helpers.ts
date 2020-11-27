import { ExtendedNotification, IAccount, StoreAccount } from '@types';
import { bigify, isBigish } from '@utils/bigify';
import { identity, ifElse, isNil, lensPath, lensProp, map, over, pipe, toString } from '@vendor';

const balanceLens = lensProp('balance');
const txValueLens = lensProp('value');
const assetLens = lensProp('assets');

export const stringifyBalance = over(balanceLens, ifElse(isBigish, toString, identity));
export const stringifyValue = over(txValueLens, toString);
export const bigifyBalnce = over(balanceLens, bigify);
export const stringifyDate = ifElse(isNil, identity, (d) => d.toString());

export const serializeAccount: (a: IAccount | StoreAccount) => IAccount | StoreAccount = pipe(
  over(assetLens, map(stringifyBalance))
);

export const serializeNotification: (n: ExtendedNotification) => ExtendedNotification = (n) => {
  return pipe(
    over(lensProp('dateDisplayed'), stringifyDate),
    over(lensProp('dateDismissed'), stringifyDate),
    over(lensPath(['templateData', 'firstDashboardVisitDate']), stringifyDate),
    over(lensPath(['templateData', 'previousNotificationCloseDate']), stringifyDate)
  )(n);
};
