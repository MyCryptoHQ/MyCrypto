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
      const updatedAddresses = {
        ...addresses,
        [toChecksumAddress(address)]: label
      };
      const updatedLabels = {
        ...labels,
        [label]: toChecksumAddress(address)
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

      delete updatedAddresses[address];
      delete updatedLabels[label];

      return {
        ...state,
        addresses: updatedAddresses,
        labels: updatedLabels
      };
    }

    case TypeKeys.SET_ADDRESS_LABEL_ENTRY: {
      return {
        ...state,
        entries: {
          ...state.entries,
          [action.payload.id]: { ...action.payload }
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
