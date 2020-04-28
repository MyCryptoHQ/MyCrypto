import * as R from 'ramda';

import { generateUUID } from 'v2/utils';
import {
  Asset,
  AssetBalanceObject,
  IAccount,
  AddressBook,
  LocalStorage,
  NetworkId,
  TUuid,
  ISettings,
  LSKeys
} from 'v2/types';

import { devAccounts, DevAccount, SeedAssetBalance, devAssets, devContacts } from '../seed';
import { StoreAction } from '../types';
import { withUuid, toArray, toObject, add } from '../helpers';

/* DevData */
const addDevAssets = add(LSKeys.ASSETS)((assets: Asset[], store: LocalStorage) => {
  const assetsToAdd = assets.reduce((acc, curr) => {
    const match = toArray(store.assets).find(
      a => a.ticker === curr.ticker && a.networkId === curr.networkId
    );
    const uuid = match ? match.uuid : curr.uuid;
    return {
      ...acc,
      [uuid]: { ...curr, uuid }
    };
  }, {});
  // ! These assets should also be added to the correct network.
  return R.mergeRight(store.assets, assetsToAdd);
});

const addDevAccounts = add(LSKeys.ACCOUNTS)((accounts: DevAccount[], store: LocalStorage) => {
  const formatAccountAssetBalance = (networkId: NetworkId) => (
    a: SeedAssetBalance
  ): AssetBalanceObject => {
    // We set static uuid for assets in our seed files.
    // In the previous step we updated the Assets uuids to match our default ones.
    // When add seed accounts we search for asset info by uuid, or update value in the account.

    const match: Asset =
      // @ts-ignore
      store.assets[a.uuid] ||
      toArray(store.assets).find(sa => sa.ticker === a.ticker && sa.networkId === networkId);

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

  return R.pipe(
    R.map(withUuid(generateUUID)),
    //@ts-ignore ie. https://github.com/DefinitelyTyped/DefinitelyTyped/issues/25581
    R.map(updateAssetUuid),
    R.reduce(toObject('uuid'), {} as any),
    R.mergeRight(store.accounts)
  )(accounts);
});

const addDevAccountsToSettings = add(LSKeys.SETTINGS)((_, store: LocalStorage) => {
  const updateDashboardAccounts = (src: TUuid[]) => ({
    dashboardAccounts,
    ...rest
  }: ISettings) => ({
    ...rest,
    dashboardAccounts: R.concat(dashboardAccounts, src)
  });
  return R.pipe(updateDashboardAccounts(R.keys(store.accounts)))(store.settings);
});

const addDevAddressBook = add(LSKeys.ADDRESS_BOOK)((contacts: Record<string, AddressBook>, _) => {
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
  // Ts doesn't recognise this spread as arguments.
  // @ts-ignore
  return R.pipe(...devDataTransducers)(initialStore);
};
