import {
  ExtendedAsset,
  ExtendedNotification,
  IAccount,
  IRates,
  LocalStorage,
  Network,
  NodeOptions,
  StoreAccount,
  TTicker
} from '@types';
import { bigify, isBigish } from '@utils';
import {
  difference,
  either,
  identity,
  ifElse,
  isNil,
  keys,
  lensPath,
  lensProp,
  map,
  mapObjIndexed,
  mergeRight,
  over,
  pipe,
  toString
} from '@vendor';

const balanceLens = lensProp('balance');
const txValueLens = lensProp('value');
const assetLens = lensProp('assets');
const transactionsLens = lensProp('transactions');

const stringifyBigish = ifElse(isBigish, toString, identity);
export const stringifyBalance = over(balanceLens, stringifyBigish);
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
  over(assetLens, map(stringifyBalance)),
  over(transactionsLens, map(mapObjIndexed(stringifyBigish)))
);

export const serializeNotification: (n: ExtendedNotification) => ExtendedNotification = (n) => {
  return pipe(
    over(lensProp('dateDisplayed'), stringifyDate),
    over(lensProp('dateDismissed'), stringifyDate),
    over(lensPath(['templateData', 'firstDashboardVisitDate']), stringifyDate),
    over(lensPath(['templateData', 'previousNotificationCloseDate']), stringifyDate)
  )(n);
};

const mergeNodes = (inbound: NodeOptions[], original: NodeOptions[]) =>
  original
    .map((o) => {
      const existing = inbound.find((i) => i.name === o.name);
      return mergeRight(o, existing || {});
    })
    .concat(inbound.filter((i) => !original.find((o) => o.name === i.name)));

export const mergeNetworks = (inbound: Network[], original: Network[]) =>
  original
    .map((o) => {
      const existing = inbound.find((i) => i.id === o.id);
      const existingNodes = existing ? existing.nodes : [];
      const selectedNode = existing ? existing.selectedNode : o.selectedNode;

      return {
        ...o,
        nodes: mergeNodes(o.nodes, existingNodes),
        selectedNode
      } as Network;
    })
    .concat(inbound.filter((i) => !original.find((o) => o.id === i.id)));

export const mergeAssets = (inbound: ExtendedAsset[], original: ExtendedAsset[]) =>
  original
    .map((o) => {
      const existing = inbound.find((i) => i.uuid === o.uuid);
      return mergeRight(o, existing || {});
    })
    .concat(inbound.filter((i) => !original.find((o) => o.uuid === i.uuid)));

/**
 * Compare json to import with our persist state
 */
export const canImport = (toImport: Partial<LocalStorage>, store: LocalStorage) => {
  if (toImport.version !== store.version) {
    return false;
  } else {
    // Check that all the keys in the store exist in the file to import
    const diff = difference(keys(store), keys(toImport));
    return diff.length === 0;
  }
};

export const destructureCoinGeckoIds = (
  rates: IRates,
  coinGeckoIdMapping: Record<string, string>
): IRates => {
  // From: { ["ethereum"]: { "usd": 123.45,"eur": 234.56 } }
  // To: { [uuid for coinGeckoId "ethereum"]: { "usd": 123.45, "eur": 234.56 } }
  const updateRateObj = (acc: any, curValue: TTicker): IRates =>
    Object.entries(coinGeckoIdMapping).reduce((acc, [assetUuid, coinGeckoId]) => {
      if (coinGeckoId === curValue) {
        acc[assetUuid] = rates[curValue];
      }
      return acc;
    }, acc as Record<string, string>);

  return Object.keys(rates).reduce(updateRateObj, {} as IRates);
};

export const buildCoinGeckoIdMapping = (assets: ExtendedAsset[]) =>
  assets.reduce((acc, a) => {
    if (a.mappings && a.mappings.coinGeckoId) {
      acc[a.uuid as string] = a.mappings.coinGeckoId;
    }
    return acc;
  }, {} as Record<string, string>);
