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

/***** Access Contracts *****/
export const ACCESS_CONTRACT = 'CONTRACTS_ACCESS_CONTRACT';
export const ACCESS_CONTRACT_SUCCESS = 'CONTRACTS_ACCESS_CONTRACT_SUCCESS';
export const ACCESS_CONTRACT_FAILURE = 'CONTRACTS_ACCESS_CONTRACT_FAILURE';

export type FetchContractAction = {
  type: ACCESS_CONTRACT,
  address: string,
  abiJson: string
};

export function accessContract(
  address: string,
  abiJson: string
): FetchContractAction {
  return {
    type: ACCESS_CONTRACT,
    address,
    abiJson
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
