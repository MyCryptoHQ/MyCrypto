import { TypeKeys } from './constants';
import {
  AddAddressLabelRequested,
  AddressLabelPair,
  AddAddressLabelSucceeded,
  AddAddressLabelFailed,
  AddAddressLabelError,
  RemoveAddressLabel
} from './actionTypes';

export type TAddAddressLabelRequested = typeof addAddressLabelRequested;
export function addAddressLabelRequested(payload: AddressLabelPair): AddAddressLabelRequested {
  return {
    type: TypeKeys.ADD_ADDRESS_LABEL_REQUESTED,
    payload
  };
}

export type TAddAddressLabelSucceeded = typeof addAddressLabelSucceeded;
export function addAddressLabelSucceeded(payload: AddressLabelPair): AddAddressLabelSucceeded {
  return {
    type: TypeKeys.ADD_ADDRESS_LABEL_SUCCEEDED,
    payload
  };
}

export type TAddAddressLabelFailed = typeof addAddressLabelFailed;
export function addAddressLabelFailed(payload: AddAddressLabelError): AddAddressLabelFailed {
  return {
    type: TypeKeys.ADD_ADDRESS_LABEL_FAILED,
    payload
  };
}

export type TRemoveAddressLabel = typeof removeAddressLabel;
export function removeAddressLabel(payload: string): RemoveAddressLabel {
  return {
    type: TypeKeys.REMOVE_ADDRESS_LABEL,
    payload
  };
}
