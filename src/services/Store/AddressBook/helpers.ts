import { IAccount, AddressBook, Network, WalletId, ExtendedAddressBook, TAddress } from '@types';
import { isSameAddress } from '@utils';
import { getWalletConfig, DEFAULT_NETWORK } from '@config';

export const getLabelByAccount = (
  account: IAccount,
  addressLabels: ExtendedAddressBook[]
): ExtendedAddressBook | undefined => {
  if (!account || !addressLabels) return;
  return addressLabels.find(
    (label) =>
      isSameAddress(account.address, label.address as TAddress) &&
      account.networkId === label.network
  );
};

export const getLabelByAddressAndNetwork = (
  address: string | undefined,
  addressLabels: ExtendedAddressBook[],
  network: Network | undefined
): ExtendedAddressBook | undefined => {
  if (!address) return;
  return addressLabels.find(
    (label) =>
      isSameAddress(address as TAddress, label.address as TAddress) &&
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

export const findMultipleNextUnusedDefaultLabels = (wallet: WalletId, numOfLabels: number) => (
  contacts: AddressBook[]
): string[] => {
  let tempContacts = contacts;
  const newLabels = [];
  for (let z = 0; z < numOfLabels; z++) {
    const newLabel = getUnusedLabel(
      tempContacts,
      (index) => `${getWalletConfig(wallet).name} Account ${index}`
    );
    newLabels.push(newLabel);
    tempContacts = [
      ...tempContacts,
      { address: '', notes: '', network: DEFAULT_NETWORK, label: newLabel }
    ];
  }
  return newLabels;
};

export const findNextRecipientLabel = (contacts: AddressBook[]) =>
  getUnusedLabel(contacts, (index) => `Recipient ${index}`);
