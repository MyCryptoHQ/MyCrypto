import { addressBookConstants, addressBookTypes } from 'features/addressBook';

export default function fixAddressBookErrors(
  addressBook: addressBookTypes.AddressBookState | undefined
) {
  if (!addressBook) {
    return {};
  }

  Object.keys(addressBook.entries).forEach(entryId => {
    const entry = addressBook.entries[entryId];

    if (entry.addressError) {
      entry.temporaryAddress = entry.address;
      delete entry.addressError;
    }

    if (entry.labelError) {
      entry.temporaryLabel = entry.label;
      delete entry.labelError;
    }
  });

  delete addressBook.entries[addressBookConstants.ADDRESS_BOOK_TABLE_ID];
  delete addressBook.entries[addressBookConstants.ACCOUNT_ADDRESS_ID];

  return addressBook;
}
