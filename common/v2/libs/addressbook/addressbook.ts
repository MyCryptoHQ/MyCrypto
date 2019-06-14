import { getCache } from 'v2/services/LocalCache/LocalCache';
import { AddressBook } from 'v2/services/AddressBook/types';
import { Account } from 'v2/services/Account';

export const getAllAddressLabels = (): AddressBook[] => {
  return Object.values(getCache().addressBook);
};

export const getLabelByAddress = (address: string): AddressBook | undefined => {
  const addressLabels: AddressBook[] = getAllAddressLabels();
  return addressLabels.find(label => address.toLowerCase() === label.address.toLowerCase());
};

export const getLabelByAccount = (account: Account): AddressBook | undefined => {
  const addressLabels: AddressBook[] = getAllAddressLabels();
  return addressLabels.find(
    label =>
      account.address.toLowerCase() === label.address.toLowerCase() &&
      account.network === label.network
  );
};

export const findNextUnusedDefaultLabel = (networkName: string): string => {
  const addressLabels: AddressBook[] = getAllAddressLabels();
  let defaultLabel: string = '';
  for (let i = 1; i <= addressLabels.length + 1; i++) {
    const draftLabel = `${networkName} Account ${i}`;
    if (addressLabels[i].label !== draftLabel) {
      defaultLabel = draftLabel;
      break;
    }
  }
  return defaultLabel;
};
