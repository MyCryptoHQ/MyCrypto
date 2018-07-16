import * as types from './types';

export const INITIAL_STATE: types.AddressBookState = {
  addresses: {},
  labels: {},
  entries: {}
};

export function addressBookReducer(
  state: types.AddressBookState = INITIAL_STATE,
  action: types.AddressBookAction
): types.AddressBookState {
  switch (action.type) {
    case types.AddressBookActions.SET_LABEL: {
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

    case types.AddressBookActions.CLEAR_LABEL: {
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

    case types.AddressBookActions.SET_LABEL_ENTRY: {
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

    case types.AddressBookActions.CLEAR_LABEL_ENTRY: {
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
