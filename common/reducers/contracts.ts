import {
  AccessContractAction,
  SetInteractiveContractAction
} from 'actions/contracts/actionTypes';

export interface State {
  selectedAddress?: string | null;
  selectedABIJson?: string | null;
  selectedABIFunctions?: any[] | null;
}

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
