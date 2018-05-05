import { toChecksumAddress } from 'ethereumjs-util';
import { TypeKeys, AddressBookAction } from 'actions/addressBook';

export interface State {
  addresses: {
    [address: string]: string;
  };
  labels: {
    [labels: string]: string;
  };
  addressErrors: {
    [index: number]: string | undefined;
  };
  labelErrors: {
    [index: number]: string | undefined;
  };
}

export const INITIAL_STATE: State = {
  addresses: {},
  labels: {},
  addressErrors: {},
  labelErrors: {}
};

export function addressBook(state: State = INITIAL_STATE, action: AddressBookAction): State {
  switch (action.type) {
    case TypeKeys.ADD_ADDRESS_LABEL_SUCCEEDED: {
      const { index, address, label } = action.payload;
      const addressErrors = { ...state.addressErrors };
      const labelErrors = { ...state.labelErrors };

      delete addressErrors[index];
      delete labelErrors[index];

      return {
        ...state,
        addresses: {
          ...state.addresses,
          [toChecksumAddress(address)]: label
        },
        labels: {
          ...state.labels,
          [label]: toChecksumAddress(address)
        },
        addressErrors,
        labelErrors
      };
    }

    case TypeKeys.ADD_ADDRESS_LABEL_FAILED: {
      const { index, addressError, labelError } = action.payload;
      const addressErrors = { ...state.addressErrors };
      const labelErrors = { ...state.labelErrors };

      if (addressError) {
        addressErrors[index] = addressError;
      }

      if (labelError) {
        labelErrors[index] = labelError;
      }

      return {
        ...state,
        addressErrors,
        labelErrors
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

    default:
      return state;
  }
}
