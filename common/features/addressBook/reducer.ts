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
      const { label } = action.payload;
      const address = action.payload.address.toLowerCase();
      const updatedAddresses = {
        ...addresses,
        [address]: label
      };
      const updatedLabels = {
        ...labels,
        [label]: address
      };

      return {
        ...state,
        addresses: updatedAddresses,
        labels: updatedLabels
      };
    }

    case addressBookTypes.AddressBookActions.CLEAR_LABEL: {
      const { addresses, labels } = state;
      const address = action.payload.toLowerCase();
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

    case addressBookTypes.AddressBookActions.SET_LABEL_ENTRY: {
      const { id } = action.payload;
      const address = action.payload.address.toLowerCase();

      return {
        ...state,
        entries: {
          ...state.entries,
          [id]: {
            ...action.payload,
            address
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
