import { ExtendedNotification, IAccount, Network, StoreAccount, TUuid } from '@types';
import { bigify, isBigish } from '@utils/bigify';
import { arrayToObj } from '@utils/toObject';
import {
  either,
  flatten,
  identity,
  ifElse,
  isNil,
  lensPath,
  lensProp,
  map,
  over,
  pipe,
  toString,
  values
} from '@vendor';

const balanceLens = lensProp('balance');
const txValueLens = lensProp('value');
const assetLens = lensProp('assets');

export const stringifyBalance = over(balanceLens, ifElse(isBigish, toString, identity));
export const stringifyValue = over(txValueLens, toString);
export const bigifyBalnce = over(balanceLens, bigify);

/**
 * input may be Date, undefined or string.
 * Convert to ISO 8601 when Date.
 */
export const stringifyDate = ifElse(
  either(isNil, (d) => typeof d === 'string'),
  identity,
  (d) => d.toISOString()
);

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

const mergeByName = pipe(arrayToObj<TUuid>('name'), values, flatten);
export const mergeNetworks = (inbound: Network[], original: Network[]) =>
  original
    .map((o) => {
      const existing = inbound.find((i) => i.id === o.id);
      const existingNodes = existing ? existing.nodes : [];
      const selectedNode = existing ? existing.selectedNode : o.selectedNode;
      const autoNode = existing ? existing.autoNode : o.autoNode;

      return {
        ...o,
        nodes: mergeByName([...o.nodes, ...existingNodes]),
        selectedNode,
        autoNode
      } as Network;
    })
    .concat(inbound.filter((i) => !original.find((o) => o.id === i.id)));
