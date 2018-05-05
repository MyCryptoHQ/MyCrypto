import { TypeKeys } from './constants';

export interface AddressLabelPair {
  index: number;
  address: string;
  label: string;
}

export interface AddAddressLabelError {
  index: number;
  addressError?: string;
  labelError?: string;
}

export interface AddAddressLabelRequested {
  type: TypeKeys.ADD_ADDRESS_LABEL_REQUESTED;
  payload: AddressLabelPair;
}

export interface AddAddressLabelSucceeded {
  type: TypeKeys.ADD_ADDRESS_LABEL_SUCCEEDED;
  payload: AddressLabelPair;
}

export interface AddAddressLabelFailed {
  type: TypeKeys.ADD_ADDRESS_LABEL_FAILED;
  payload: AddAddressLabelError;
}

export interface RemoveAddressLabel {
  type: TypeKeys.REMOVE_ADDRESS_LABEL;
  payload: string;
}

export type AddressBookAction =
  | AddAddressLabelRequested
  | AddAddressLabelSucceeded
  | AddAddressLabelFailed
  | RemoveAddressLabel;
