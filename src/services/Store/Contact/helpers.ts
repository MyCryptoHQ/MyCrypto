import { DEFAULT_NETWORK, getWalletConfig, STATIC_CONTACTS } from '@config';
import {
  Contact,
  ExtendedContact,
  ExtendedContract,
  IAccount,
  Network,
  NetworkId,
  TAddress,
  WalletId
} from '@types';
import { isSameAddress } from '@utils';

export const getLabelByAccount = (
  account: IAccount,
  addressLabels: ExtendedContact[]
): ExtendedContact | undefined => {
  if (!account || !addressLabels) return;
  return addressLabels.find(
    (label) =>
      isSameAddress(account.address, label.address as TAddress) &&
      account.networkId === label.network
  );
};

export const getLabelByAddressAndNetwork = (
  address: string | undefined,
  addressLabels: ExtendedContact[],
  network: Network | undefined
): ExtendedContact | undefined => {
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

const getUnusedLabel = (contacts: Contact[], generateLabel: (index: number) => string) => {
  let index = 0;
  let isFound: Contact | undefined;
  let unusedLabel: string;
  do {
    index += 1;
    unusedLabel = generateLabel(index);
    isFound = contacts.find((a) => a.label === unusedLabel);
  } while (isFound);

  return unusedLabel;
};

export const findMultipleNextUnusedDefaultLabels = (wallet: WalletId, numOfLabels: number) => (
  contacts: Contact[]
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

export const findNextRecipientLabel = (contacts: Contact[]) =>
  getUnusedLabel(contacts, (index) => `Recipient ${index}`);

export const getContactFromContracts = (contracts: ExtendedContract[]) => (
  address: TAddress,
  networkId?: NetworkId
): ExtendedContact | undefined => {
  const contract = contracts.find(
    (c) => c.address === address && (c.networkId === networkId || !networkId)
  );
  const contact: ExtendedContact | undefined = contract && {
    address,
    label: contract.name,
    network: contract.networkId,
    notes: '',
    uuid: contract.uuid
  };
  return contact;
};

export const getContactByAddressAndNetworkId = (
  contacts: ExtendedContact[],
  contracts: ExtendedContract[]
) => (address: TAddress, networkId: NetworkId) => {
  return (
    [...contacts, ...STATIC_CONTACTS]
      .filter((contact: ExtendedContact) => contact.network === networkId)
      .find((contact: ExtendedContact) => isSameAddress(contact.address as TAddress, address)) ??
    getContactFromContracts(contracts)(address, networkId)
  );
};
