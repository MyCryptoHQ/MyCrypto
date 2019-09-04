import { getCache } from '../LocalCache';
import { Account, AddressBook } from 'v2/types';

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
      account.networkId === label.network
  );
};

/* @desc
/ The idea is that when a user adds their account,
/ it’s created with this default label
/ that they can change later which differentiates between accounts.
/ `New Ethereum Account 1` vs `New Ethereum Account 2` vs `New Ethereum Classic Account 1`
*/
export const findNextUnusedDefaultLabel = (networkName: string): string => {
  const addressLabels: AddressBook[] = getAllAddressLabels();
  let index = 0;
  let isFound: AddressBook | undefined;
  let unusedLabel: string;
  do {
    index += 1;
    unusedLabel = `${networkName} Account ${index}`;
    isFound = addressLabels.find(label => label.label === unusedLabel);
  } while (isFound);

  return unusedLabel;
};
