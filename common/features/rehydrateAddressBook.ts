import { addressBookConstants, addressBookTypes, addressBookReducer } from './addressBook';

export default function rehydrateAddressBookState(
  ab: addressBookTypes.AddressBookState | undefined
): addressBookTypes.AddressBookState {
  const addressBook = { ...addressBookReducer.INITIAL_STATE };
  if (!ab) {
    return addressBookReducer.INITIAL_STATE;
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
    if (
      id === addressBookConstants.ADDRESS_BOOK_TABLE_ID ||
      id === addressBookConstants.ACCOUNT_ADDRESS_ID
    ) {
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
