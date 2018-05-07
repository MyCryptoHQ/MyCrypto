import { State as AddressBookState } from 'reducers/addressBook';

export default function fixAddressBookErrors(addressBook: AddressBookState | undefined) {
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

  return addressBook;
}
