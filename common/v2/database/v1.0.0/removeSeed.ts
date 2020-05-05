import differenceWith from 'ramda/src/differenceWith';
import reduce from 'ramda/src/reduce';
import pipe from 'ramda/src/pipe';

import {
  AddressBook,
  IAccount,
  ExtendedAddressBook,
  LocalStorage,
  TUuid,
  ISettings,
  LSKeys
} from 'v2/types';

import { devAccounts, DevAccount, devContacts } from '../seed';
import { toArray, toObject, add } from '../helpers';

const removeDevAccounts = add(LSKeys.ACCOUNTS)((accounts: DevAccount[], store: LocalStorage) => {
  const cmp = (x: IAccount, y: DevAccount) => x.address === y.address;
  const toKeep = differenceWith(cmp, toArray(store.accounts), accounts);
  return reduce(toObject('uuid'), {}, toKeep);
});

const removeDevAccountsFromSettings = add(LSKeys.SETTINGS)(
  (accounts: DevAccount[], store: LocalStorage) => {
    const cmp = (x: IAccount, y: DevAccount) => x.address === y.address;
    const devAccountUuids = differenceWith(cmp, toArray(store.accounts), accounts).map(
      (a) => a.uuid
    );

    const updateDashboardAccounts = (favoritesWithoutDevAccounts: TUuid[]) => ({
      dashboardAccounts,
      ...rest
    }: ISettings) => ({
      ...rest,
      dashboardAccounts: favoritesWithoutDevAccounts
    });

    return pipe(updateDashboardAccounts(devAccountUuids))(store.settings);
  }
);

const removeDevAddressBook = add(LSKeys.ADDRESS_BOOK)(
  (contacts: Record<string, AddressBook>, store: LocalStorage) => {
    const cmp = (x: ExtendedAddressBook, y: AddressBook) => x.address === y.address;
    const withoutDevContacts = differenceWith(cmp, toArray(store.addressBook), toArray(contacts));
    return reduce(toObject('uuid'), {}, withoutDevContacts);
  }
);

/* Handler to trigger the flow according the environment */
type Transduce = (z: LocalStorage) => LocalStorage;
export const removeSeedDataFromSchema: Transduce = (initialStore: LocalStorage) => {
  // Ts doesn't recognise this spread as arguments.
  // @ts-ignore
  return pipe(
    removeDevAddressBook(toArray(devContacts)),
    removeDevAccountsFromSettings(devAccounts),
    removeDevAccounts(toArray(devAccounts))
  )(initialStore);
};
