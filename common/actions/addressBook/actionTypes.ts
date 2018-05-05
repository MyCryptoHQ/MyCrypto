import { TypeKeys } from './constants';

export interface AddressLabel {
  address: string;
  label: string;
}

export interface AddressLabelEntry {
  id: string;
  address: string;
  addressError?: string;
  label: string;
  labelError?: string;
}

export interface AddAddressLabel {
  type: TypeKeys.ADD_ADDRESS_LABEL;
  payload: AddressLabel;
}

export interface RemoveAddressLabel {
  type: TypeKeys.REMOVE_ADDRESS_LABEL;
  payload: string;
}

export interface SetAddressLabelEntry {
  type: TypeKeys.SET_ADDRESS_LABEL_ENTRY;
  payload: AddressLabelEntry;
}

export interface ChangeAddressLabelEntry {
  type: TypeKeys.CHANGE_ADDRESS_LABEL_ENTRY;
  payload: AddressLabelEntry;
}

export interface SaveAddressLabelEntry {
  type: TypeKeys.SAVE_ADDRESS_LABEL_ENTRY;
  payload: string;
}

export interface ClearAddressLabelEntry {
  type: TypeKeys.CLEAR_ADDRESS_LABEL_ENTRY;
  payload: string;
}

export type AddressBookAction =
  | AddAddressLabel
  | RemoveAddressLabel
  | SetAddressLabelEntry
  | ChangeAddressLabelEntry
  | SaveAddressLabelEntry
  | ClearAddressLabelEntry;
