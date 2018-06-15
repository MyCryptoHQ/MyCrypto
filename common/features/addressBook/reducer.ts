import { toChecksumAddress } from 'ethereumjs-util';

import * as addressBookConstants from './constants';
import * as addressBookTypes from './types';

export const INITIAL_STATE: addressBookTypes.AddressBookState = {
  addresses: {},
  labels: {},
  entries: {}
};

export function addressBookReducer(
  state: addressBookTypes.AddressBookState = INITIAL_STATE,
  action: addressBookTypes.AddressBookAction
): addressBookTypes.AddressBookState {
  switch (action.type) {
    case addressBookTypes.AddressBookActions.SET_LABEL: {
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

    case addressBookTypes.AddressBookActions.CLEAR_LABEL: {
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

    case addressBookTypes.AddressBookActions.SET_LABEL_ENTRY: {
      const { id, address } = action.payload;
      const checksummedAddress = toChecksumAddress(address);
      const isNonRowEntry =
        id === addressBookConstants.ADDRESS_BOOK_TABLE_ID ||
        id === addressBookConstants.ACCOUNT_ADDRESS_ID;

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

    case addressBookTypes.AddressBookActions.CLEAR_LABEL_ENTRY: {
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
