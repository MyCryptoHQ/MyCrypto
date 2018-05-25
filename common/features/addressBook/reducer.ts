import { toChecksumAddress } from 'ethereumjs-util';

import { ADDRESS_BOOK_TABLE_ID, ACCOUNT_ADDRESS_ID } from './constants';
import { ADDRESS_BOOK, AddressBookAction, AddressBookState } from './types';

export const INITIAL_STATE: AddressBookState = {
  addresses: {},
  labels: {},
  entries: {}
};

export function addressBookReducer(
  state: AddressBookState = INITIAL_STATE,
  action: AddressBookAction
): AddressBookState {
  switch (action.type) {
    case ADDRESS_BOOK.SET_LABEL: {
      const { addresses, labels } = state;
      const { address, label } = action.payload;
      const checksummedAddress = toChecksumAddress(address);
      const updatedAddresses = {
        ...addresses,
        [checksummedAddress]: label
      };
      const updatedLabels = {
        ...labels,
        [label]: checksummedAddress
      };

      return {
        ...state,
        addresses: updatedAddresses,
        labels: updatedLabels
      };
    }

    case ADDRESS_BOOK.CLEAR_LABEL: {
      const { addresses, labels } = state;
      const address = action.payload;
      const label = addresses[address];
      const updatedAddresses = { ...addresses };
      const updatedLabels = { ...labels };

      delete updatedAddresses[toChecksumAddress(address)];
      delete updatedLabels[label];

      return {
        ...state,
        addresses: updatedAddresses,
        labels: updatedLabels
      };
    }

    case ADDRESS_BOOK.SET_LABEL_ENTRY: {
      const { id, address } = action.payload;
      const checksummedAddress = toChecksumAddress(address);
      const isNonRowEntry = id === ADDRESS_BOOK_TABLE_ID || id === ACCOUNT_ADDRESS_ID;

      return {
        ...state,
        entries: {
          ...state.entries,
          [id]: {
            ...action.payload,
            address: isNonRowEntry ? address : checksummedAddress
          }
        }
      };
    }

    case ADDRESS_BOOK.CLEAR_LABEL_ENTRY: {
      const id = action.payload;
      const entries = { ...state.entries };

      delete entries[id];

      return {
        ...state,
        entries
      };
    }

    default:
      return state;
  }
}
