import { AddressBookAction } from 'actions/addressBook';
import { TypeKeys } from 'actions/addressBook/constants';

interface AddressesToLabels {
  [address: string]: string;
}

export interface State {
  labels: AddressesToLabels;
}

export const INITIAL_STATE: State = {
  labels: {}
};

export function addressBook(state: State = INITIAL_STATE, action: AddressBookAction): State {
  switch (action.type) {
    case TypeKeys.ADD_LABEL_FOR_ADDRESS: {
      const { address, label } = action.payload;

      return {
        ...state,
        labels: {
          ...state.labels,
          [address]: label
        }
      };
    }

    case TypeKeys.REMOVE_LABEL_FOR_ADDRESS: {
      const address = action.payload;
      const { labels: previousLabels } = state;
      const labels = { ...previousLabels };

      delete labels[address];

      return {
        ...state,
        labels
      };
    }

    default:
      return state;
  }
}
