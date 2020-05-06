import { IAccount, AddressBook, Network, WalletId, ExtendedAddressBook } from 'v2/types';
import { getWalletConfig } from 'v2/config';

export const getLabelByAccount = (
  account: IAccount,
  addressLabels: ExtendedAddressBook[]
): ExtendedAddressBook | undefined => {
  if (!account || !addressLabels) return;
  return addressLabels.find(
    (label) =>
      account.address.toLowerCase() === label.address.toLowerCase() &&
      account.networkId === label.network
  );
};

export const getLabelByAddressAndNetwork = (
  address: string | undefined,
  addressLabels: AddressBook[],
  network: Network | undefined
): AddressBook | undefined => {
  if (!address) return;
  return addressLabels.find(
    (label) =>
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

const getUnusedLabel = (contacts: AddressBook[], generateLabel: (index: number) => string) => {
  let index = 0;
  let isFound: AddressBook | undefined;
  let unusedLabel: string;
  do {
    index += 1;
    unusedLabel = generateLabel(index);
    isFound = contacts.find((a) => a.label === unusedLabel);
  } while (isFound);

  return unusedLabel;
};

export const findNextUnusedDefaultLabel = (wallet: WalletId) => (contacts: AddressBook[]): string =>
  getUnusedLabel(contacts, (index) => `${getWalletConfig(wallet).name} Account ${index}`);

export const findNextRecipientLabel = (contacts: AddressBook[]) =>
  getUnusedLabel(contacts, (index) => `Recipient ${index}`);
