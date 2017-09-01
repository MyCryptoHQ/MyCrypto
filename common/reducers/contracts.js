import type {
  AccessContractAction,
  SetInteractiveContractAction
} from 'actions/contracts';

export type State = {
  selectedAddress: ?string,
  selectedABIJson: ?string,
  selectedABIFunctions: ?Array
};

export const initialState: State = {
  // Interact
  selectedAddress: null,
  selectedABIJson: null,
  selectedABIFunctions: null
};

type Action = AccessContractAction | SetInteractiveContractAction;

export function contracts(state: State = initialState, action: Action) {
  switch (action.type) {
    case 'ACCESS_CONTRACT':
      return {
        ...state,
        selectedAddress: action.address,
        selectedABIJson: action.abiJson
      };

    case 'SET_INTERACTIVE_CONTRACT':
      return {
        ...state,
        selectedABIFunctions: action.functions
      };

    default:
      return state;
  }
}
