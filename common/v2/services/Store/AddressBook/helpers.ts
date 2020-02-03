
import { Account, AddressBook, Network, WalletId, ExtendedAddressBook } from 'v2/types';
import { WALLETS_CONFIG } from 'v2/config';

export const getLabelByAccount = (
  account: Account,
  addressLabels: ExtendedAddressBook[]
): ExtendedAddressBook | undefined => {
if (!account || !addressLabels) return;
  return addressLabels.find(
    label =>
      account.address.toLowerCase() === label.address.toLowerCase() &&
      account.networkId === label.network
  );
};

export const getLabelByAddressAndNetwork = (
  address: string,
  addressLabels: AddressBook[],
  network: Network | undefined
): AddressBook | undefined => {
  return addressLabels.find(
    label =>
      address.toLowerCase() === label.address.toLowerCase() &&
      (network ? network.id === label.network : true)
  );
};

/* @desc
/ The idea is that when a user adds their account,
/ it’s created with this default label
/ that they can change later which differentiates between accounts.
/ `New Ethereum Account 1` vs `New Ethereum Account 2` vs `New Ethereum Classic Account 1`
*/
export const findNextUnusedDefaultLabel = (wallet: WalletId) => (
  contacts: AddressBook[]
): string => {
  let index = 0;
  let isFound: AddressBook | undefined;
  let unusedLabel: string;
  do {
    index += 1;
    unusedLabel = `${WALLETS_CONFIG[wallet].name} Account ${index}`;
    isFound = contacts.find(a => a.label === unusedLabel);
  } while (isFound);

  return unusedLabel;
};
