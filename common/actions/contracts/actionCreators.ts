import * as interfaces from './actionTypes';
import * as constants from './constants';

export function accessContract(
  address: string,
  abiJson: string
): interfaces.AccessContractAction {
  return {
    type: constants.ACCESS_CONTRACT,
    address,
    abiJson
  };
}

export function setInteractiveContract(
  functions: interfaces.ABIFunction[]
): interfaces.SetInteractiveContractAction {
  return {
    type: constants.SET_INTERACTIVE_CONTRACT,
    functions
  };
}
