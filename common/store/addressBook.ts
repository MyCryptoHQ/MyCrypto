import { State as AddressBookState, INITIAL_STATE } from 'reducers/addressBook';
import { ADDRESS_BOOK_TABLE_ID } from 'components/AddressBookTable';
import { ACCOUNT_ADDRESS_ID } from 'components/BalanceSidebar/AccountAddress';

export default function rehydrateAddressBookState(
  ab: AddressBookState | undefined
): AddressBookState {
  const addressBook = { ...INITIAL_STATE };
  if (!ab) {
    return INITIAL_STATE;
  }

  // Lower case addresses
  Object.keys(ab.addresses).forEach(address => {
    addressBook.addresses[address.toLowerCase()] = ab.addresses[address];
  });

  Object.keys(ab.labels).forEach(label => {
    addressBook.labels[label] = ab.labels[label].toLowerCase();
  });

  Object.keys(ab.entries).forEach(id => {
    // Remove the temporary entries that address book and account store info in
    if (id === ADDRESS_BOOK_TABLE_ID || id === ACCOUNT_ADDRESS_ID) {
      return;
    }

    const entry = {
      ...ab.entries[id],
      address: ab.entries[id].address.toLowerCase()
    };

    // Convert errorous entries into temporary ones
    if (entry.addressError) {
      entry.temporaryAddress = entry.address;
      delete entry.addressError;
    }
    if (entry.labelError) {
      entry.temporaryLabel = entry.label;
      delete entry.labelError;
    }

    addressBook.entries[id] = entry;
  });

  return addressBook;
}
