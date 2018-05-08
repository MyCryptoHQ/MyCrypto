import { toChecksumAddress } from 'ethereumjs-util';
import { TypeKeys, AddressBookAction, AddressLabelEntry } from 'actions/addressBook';

export interface State {
  addresses: {
    [address: string]: string;
  };
  labels: {
    [labels: string]: string;
  };
  entries: {
    [id: string]: AddressLabelEntry;
  };
}

export const INITIAL_STATE: State = {
  addresses: {},
  labels: {},
  entries: {}
};

export function addressBook(state: State = INITIAL_STATE, action: AddressBookAction): State {
  switch (action.type) {
    case TypeKeys.SET_ADDRESS_LABEL: {
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

    case TypeKeys.CLEAR_ADDRESS_LABEL: {
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

    case TypeKeys.SET_ADDRESS_LABEL_ENTRY: {
      const { id, address } = action.payload;
      const checksummedAddress = toChecksumAddress(address);
      const isNonRowEntry = id === 'ADDRESS_BOOK_TABLE_ID' || id === 'ACCOUNT_ADDRESS_ID';

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

    case TypeKeys.CLEAR_ADDRESS_LABEL_ENTRY: {
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
