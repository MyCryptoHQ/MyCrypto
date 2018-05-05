import { toChecksumAddress } from 'ethereumjs-util';
import { TypeKeys, AddressBookAction } from 'actions/addressBook';

export interface State {
  addresses: {
    [address: string]: string;
  };
  labels: {
    [labels: string]: string;
  };
  entries: {
    [id: string]: {
      address: string;
      addressError: string | undefined;
      label: string;
      labelError: string | undefined;
    };
  };
}

export const INITIAL_STATE: State = {
  addresses: {},
  labels: {},
  entries: {}
};

export function addressBook(state: State = INITIAL_STATE, action: AddressBookAction): State {
  switch (action.type) {
    case TypeKeys.ADD_ADDRESS_LABEL: {
      const { address, label } = action.payload;

      return {
        ...state,
        addresses: {
          ...state.addresses,
          [toChecksumAddress(address)]: label
        },
        labels: {
          ...state.labels,
          [label]: toChecksumAddress(address)
        }
      };
    }

    case TypeKeys.REMOVE_ADDRESS_LABEL: {
      const address = action.payload;
      const addresses = { ...state.addresses };
      const labels = { ...state.labels };
      const label = addresses[address];

      delete addresses[toChecksumAddress(address)];
      delete labels[label];

      return {
        ...state,
        addresses,
        labels
      };
    }

    case TypeKeys.SET_ADDRESS_LABEL_ENTRY: {
      const { id, address, addressError, label, labelError } = action.payload;
      const entries = {
        ...state.entries,
        [id]: {
          address,
          addressError,
          label,
          labelError
        }
      };

      return {
        ...state,
        entries
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
