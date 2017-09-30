import { TypeKeys } from './constants';
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
  type: TypeKeys.SET_INTERACTIVE_CONTRACT;
  functions: ABIFunction[];
}

/***** Access Contract *****/
export interface AccessContractAction {
  type: TypeKeys.ACCESS_CONTRACT;
  address: string;
  abiJson: string;
}

/*** Union Type ***/
export type ContractsAction =
  | SetInteractiveContractAction
  | AccessContractAction;
