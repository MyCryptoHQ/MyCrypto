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
export type NodeContract = {
  name: string,
  address: string,
  abi: string
};

export type SetNodeContractsAction = {
  type: SET_NODE_CONTRACTS,
  contracts: Array<NodeContract>
};

export function setNodeContracts(
  contracts: Array<NodeContract>
): SetNodeContractsAction {
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
export type ABIFunctionField = {
  name: string,
  type: string
};

export type ABIFunction = {
  name: string,
  type: string,
  constant: boolean,
  inputs: Array<ABIFunctionField>,
  outputs: Array<ABIFunctionField>
};

export type SetInteractiveContractAction = {
  type: ACCESS_CONTRACT,
  functions: Array<ABIFunction>
};

export function setInteractiveContract(
  functions: Array<ABIFunction>
): SetInteractiveContractAction {
  return {
    type: SET_INTERACTIVE_CONTRACT,
    functions
  };
}
