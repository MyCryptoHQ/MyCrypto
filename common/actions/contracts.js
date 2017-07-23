// @flow
import {
  FETCH_NODE_CONTRACTS,
  SET_NODE_CONTRACTS,
  ACCESS_CONTRACT,
  SET_INTERACTIVE_CONTRACT
} from './contractsConstants';

/***** Fetch Node Contracts *****/
export type FetchNodeContractsAction = {
  type: FETCH_NODE_CONTRACTS
};

export function fetchNodeContracts(): FetchNodeContractsAction {
  return { type: FETCH_NODE_CONTRACTS };
}

/***** Set Node Contracts *****/
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
export type AccessContractAction = {
  type: ACCESS_CONTRACT,
  address: string,
  abiJson: string
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

/***** Set Interactive Contract *****/
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
