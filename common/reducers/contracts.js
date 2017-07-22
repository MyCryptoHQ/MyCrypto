import {
  SET_NODE_CONTRACTS,
  ACCESS_CONTRACT,
  ACCESS_CONTRACT_SUCCESS,
  ACCESS_CONTRACT_FAILURE,
  DEPLOY_CONTRACT,
  DEPLOY_CONTRACT_SUCCESS,
  DEPLOY_CONTRACT_FAILURE
} from 'actions/contracts';

export type State = {
  nodeContracts: Array,
  selectedAddress: ?string,
  selectedABIJson: ?string,
  selectedABIFunctions: ?Array,
  accessError: ?string
};

export const initialState: State = {
  // Interact
  nodeContracts: [],
  selectedAddress: null,
  selectedABIJson: null,
  selectedABIFunctions: null,
  accessError: null
};

export function contracts(state: State = initialState, action: Object) {
  switch (action.type) {
    case SET_NODE_CONTRACTS:
      return {
        ...state,
        nodeContracts: action.contracts
      };

    case ACCESS_CONTRACT:
    case ACCESS_CONTRACT_SUCCESS:
    case ACCESS_CONTRACT_FAILURE:
      console.log(action);
      return state;

    case DEPLOY_CONTRACT:
    case DEPLOY_CONTRACT_SUCCESS:
    case DEPLOY_CONTRACT_FAILURE:
      console.log(action);
      return state;

    default:
      return state;
  }
}
