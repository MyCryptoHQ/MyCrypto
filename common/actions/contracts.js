// @flow

/***** Access Contract *****/
export type AccessContractAction = {
  type: 'ACCESS_CONTRACT',
  address: string,
  abiJson: string
};

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
  type: 'SET_INTERACTIVE_CONTRACT',
  functions: Array<ABIFunction>
};

export function setInteractiveContract(
  functions: Array<ABIFunction>
): SetInteractiveContractAction {
  return {
    type: 'SET_INTERACTIVE_CONTRACT',
    functions
  };
}
