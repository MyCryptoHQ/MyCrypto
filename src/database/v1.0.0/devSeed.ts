import {
  Asset,
  AssetBalanceObject,
  Contact,
  IAccount,
  ISettings,
  LocalStorage,
  LSKeys,
  NetworkId,
  TUuid
} from '@types';
import { generateUUID } from '@utils';
import { concat, keys, map, mergeRight, pipe, reduce } from '@vendor';

import { add, toArray, toObject, withUuid } from '../helpers';
import { DevAccount, devAccounts, devAssets, devContacts, SeedAssetBalance } from '../seed';
import { StoreAction } from '../types';

/* DevData */
const addDevAssets = add(LSKeys.ASSETS)((assets: Asset[], store: LocalStorage) => {
  const assetsToAdd = assets.reduce((acc, curr) => {
    const match = toArray(store.assets).find(
      (a) => a.ticker === curr.ticker && a.networkId === curr.networkId
    );
    const uuid = match ? match.uuid : curr.uuid;
    return {
      ...acc,
      [uuid]: { ...curr, uuid }
    };
  }, {});
  // ! These assets should also be added to the correct network.
  return mergeRight(store.assets, assetsToAdd);
});

const addDevAccounts = add(LSKeys.ACCOUNTS)((accounts: DevAccount[], store: LocalStorage) => {
  const formatAccountAssetBalance = (networkId: NetworkId) => (
    a: SeedAssetBalance
  ): AssetBalanceObject => {
    // We set static uuid for assets in our seed files.
    // In the previous step we updated the Assets uuids to match our default ones.
    // When add seed accounts we search for asset info by uuid, or update value in the account.

    const match: Asset =
      (store.assets as Record<any, Asset>)[a.uuid] ||
      toArray(store.assets).find((sa) => sa.ticker === a.ticker && sa.networkId === networkId);

    return {
      balance: a.balance,
      mtime: a.mtime,
      uuid: match ? match.uuid : a.uuid
    };
  };

  const updateAssetUuid = ({ assets, ...rest }: IAccount): IAccount => ({
    ...rest,
    assets: assets.map(formatAccountAssetBalance(rest.networkId))
  });

  return pipe(
    map(withUuid(generateUUID)),
    //@ts-expect-error: ie. https://github.com/DefinitelyTyped/DefinitelyTyped/issues/25581
    map(updateAssetUuid),
    reduce(toObject('uuid'), {} as any),
    mergeRight(store.accounts)
    //@ts-expect-error: pipe() expects 0 arguments !?
  )(accounts);
});

const addDevAccountsToSettings = add(LSKeys.SETTINGS)((_, store: LocalStorage) => {
  const updateDashboardAccounts = (src: TUuid[]) => ({
    dashboardAccounts,
    ...rest
  }: ISettings) => ({
    ...rest,
    dashboardAccounts: concat(dashboardAccounts, src)
  });
  return pipe(updateDashboardAccounts(keys(store.accounts)))(store.settings);
});

const addDevAddressBook = add(LSKeys.ADDRESS_BOOK)((contacts: Record<string, Contact>) => {
  return contacts;
});

const devDataTransducers: StoreAction[] = [
  addDevAssets(toArray(devAssets)),
  addDevAccounts(toArray(devAccounts)),
  addDevAddressBook(devContacts),
  addDevAccountsToSettings()
];

/* Handler to trigger the flow according the environment */
type Transduce = (z: LocalStorage) => LocalStorage;
export const addDevSeedToSchema: Transduce = (initialStore: LocalStorage) => {
  // @ts-expect-error: TS doesn't recognise this spread as arguments.
  return pipe(...devDataTransducers)(initialStore);
};
