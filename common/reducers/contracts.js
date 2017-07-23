import {
  SET_NODE_CONTRACTS,
  SET_INTERACTIVE_CONTRACT,
  ACCESS_CONTRACT
} from 'actions/contractsConstants';

export type State = {
  nodeContracts: Array,
  selectedAddress: ?string,
  selectedABIJson: ?string,
  selectedABIFunctions: ?Array
};

export const initialState: State = {
  // Interact
  nodeContracts: [],
  selectedAddress: null,
  selectedABIJson: null,
  selectedABIFunctions: null
};

export function contracts(state: State = initialState, action: Object) {
  switch (action.type) {
    case SET_NODE_CONTRACTS:
      return {
        ...state,
        nodeContracts: action.contracts
      };

    case ACCESS_CONTRACT:
      return {
        ...state,
        selectedAddress: action.address,
        selectedABIJson: action.abiJson
      };

    case SET_INTERACTIVE_CONTRACT:
      return {
        ...state,
        selectedABIFunctions: action.functions
      };

    default:
      return state;
  }
}
