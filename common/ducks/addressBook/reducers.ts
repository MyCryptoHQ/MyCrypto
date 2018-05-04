import { toChecksumAddress } from 'ethereumjs-util';
import { TypeKeys, AddressBookAction } from './types';

export interface AddressToLabelDictionary {
  [address: string]: string;
}

export interface State {
  labels: AddressToLabelDictionary;
}

export const INITIAL_STATE: State = {
  labels: {}
};

export default function addressBook(
  state: State = INITIAL_STATE,
  action: AddressBookAction
): State {
  switch (action.type) {
    case TypeKeys.ADD_LABEL_FOR_ADDRESS: {
      const { address, label } = action.payload;

      return {
        ...state,
        labels: {
          ...state.labels,
          [toChecksumAddress(address)]: label
        }
      };
    }

    case TypeKeys.REMOVE_LABEL_FOR_ADDRESS: {
      const address = action.payload;
      const { labels: previousLabels } = state;
      const labels = { ...previousLabels };

      delete labels[toChecksumAddress(address)];

      return {
        ...state,
        labels
      };
    }

    default:
      return state;
  }
}
