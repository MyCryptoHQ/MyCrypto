/***** Access Contract *****/
export interface AccessContractAction {
  type: 'ACCESS_CONTRACT';
  address: string;
  abiJson: string;
}

export function accessContract(
  address: string,
  abiJson: string
): AccessContractAction {
  return {
    type: 'ACCESS_CONTRACT',
    address,
    abiJson
  };
}

/***** Set Interactive Contract *****/
export interface ABIFunctionField {
  name: string;
  type: string;
}

export interface ABIFunction {
  name: string;
  type: string;
  constant: boolean;
  inputs: ABIFunctionField[];
  outputs: ABIFunctionField[];
}

export interface SetInteractiveContractAction {
  type: 'SET_INTERACTIVE_CONTRACT';
  functions: ABIFunction[];
}

export function setInteractiveContract(
  functions: ABIFunction[]
): SetInteractiveContractAction {
  return {
    type: 'SET_INTERACTIVE_CONTRACT',
    functions
  };
}
