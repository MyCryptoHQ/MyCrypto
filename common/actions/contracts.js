// @flow

/***** Fetch Node Contracts *****/
export const FETCH_NODE_CONTRACTS = 'CONTRACTS_FETCH_NODE_CONTRACTS';

export type FetchNodeContractsAction = {
  type: FETCH_NODE_CONTRACTS
};

export function fetchNodeContracts(): FetchNodeContractsAction {
  return { type: FETCH_NODE_CONTRACTS };
}

/***** Set Node Contracts *****/
export const SET_NODE_CONTRACTS = 'CONTRACTS_SET_NODE_CONTRACTS';

export type SetNodeContractsAction = {
  type: SET_NODE_CONTRACTS,
  contracts: Array
};

export function setNodeContracts(contracts: Array): SetNodeContractsAction {
  return {
    type: SET_NODE_CONTRACTS,
    contracts: contracts
  };
}

/***** Access Contract *****/
export const ACCESS_CONTRACT = 'CONTRACTS_ACCESS_CONTRACT';
export const ACCESS_CONTRACT_ERROR = 'CONTRACTS_ACCESS_CONTRACT_ERROR';

export type AccessContractAction = {
  type: ACCESS_CONTRACT,
  address: string,
  abiJson: string
};
export type AccessContractErrorAction = {
  type: ACCESS_CONTRACT_ERROR,
  error: Error
};

export function accessContract(
  address: string,
  abiJson: string
): AccessContractAction {
  return {
    type: ACCESS_CONTRACT,
    address,
    abiJson
  };
}

export function accessContractError(error: Error): AccessContractErrorAction {
  return {
    type: ACCESS_CONTRACT_ERROR,
    error
  };
}

/***** Set Interactive Contract *****/
export const SET_INTERACTIVE_CONTRACT = 'CONTRACTS_SET_INTERACTIVE_CONTRACT';

export type SetInteractiveContractAction = {
  type: ACCESS_CONTRACT,
  abiFunctions: Array
};

export function setInteractiveContract(
  functions: string
): SetInteractiveContractAction {
  return {
    type: SET_INTERACTIVE_CONTRACT,
    functions
  };
}

/***** Deploy Contracts *****/
export const DEPLOY_CONTRACT = 'CONTRACTS_DEPLOY_CONTRACT';
export const DEPLOY_CONTRACT_SUCCESS = 'CONTRACTS_DEPLOY_CONTRACT_SUCCESS';
export const DEPLOY_CONTRACT_FAILURE = 'CONTRACTS_DEPLOY_CONTRACT_FAILURE';

export type DeployContractAction = {
  type: DEPLOY_CONTRACT,
  byteCode: string,
  gasLimit: number
};

export function deployContract(
  byteCode: string,
  gasLimit: number
): DeployContractAction {
  return {
    type: DEPLOY_CONTRACT,
    byteCode,
    gasLimit
  };
}
