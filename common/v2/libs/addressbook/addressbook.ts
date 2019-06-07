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

export const getDefaultLabel = (networkName: string): string => {
  const addressLabels: AddressBook[] = getAllAddressLabels();
  let iterator = 1;
  let defaultLabel: string | undefined;
  do {
    const isFound: AddressBook | undefined = addressLabels.find(
      label => label.label === `New ${networkName} Account ${iterator}`
    );
    defaultLabel = !isFound ? `New ${networkName} Account ${iterator}` : undefined;
    iterator += 1;
  } while (!defaultLabel);
  return defaultLabel;
};
