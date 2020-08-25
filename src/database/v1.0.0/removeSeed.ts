import differenceWith from 'ramda/src/differenceWith';
import reduce from 'ramda/src/reduce';
import pipe from 'ramda/src/pipe';

import {
  Contact,
  IAccount,
  ExtendedContact,
  LocalStorage,
  TUuid,
  ISettings,
  LSKeys,
  TAddress
} from '@types';
import { isSameAddress } from '@utils';

import { devAccounts, DevAccount, devContacts } from '../seed';
import { toArray, toObject, add } from '../helpers';

const removeDevAccounts = add(LSKeys.ACCOUNTS)((accounts: DevAccount[], store: LocalStorage) => {
  const cmp = (x: IAccount, y: DevAccount) => isSameAddress(x.address, y.address);
  const toKeep = differenceWith(cmp, toArray(store.accounts), accounts);
  return reduce(toObject('uuid'), {}, toKeep);
});

const removeDevAccountsFromSettings = add(LSKeys.SETTINGS)(
  (accounts: DevAccount[], store: LocalStorage) => {
    const cmp = (x: IAccount, y: DevAccount) => isSameAddress(x.address, y.address);
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
  (contacts: Record<string, Contact>, store: LocalStorage) => {
    const cmp = (x: ExtendedContact, y: Contact) =>
      isSameAddress(x.address as TAddress, y.address as TAddress);
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
