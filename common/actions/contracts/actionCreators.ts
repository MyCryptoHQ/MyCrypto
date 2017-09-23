import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';

export function accessContract(
  address: string,
  abiJson: string
): interfaces.AccessContractAction {
  return {
    type: TypeKeys.ACCESS_CONTRACT,
    address,
    abiJson
  };
}

export function setInteractiveContract(
  functions: interfaces.ABIFunction[]
): interfaces.SetInteractiveContractAction {
  return {
    type: TypeKeys.SET_INTERACTIVE_CONTRACT,
    functions
  };
}
