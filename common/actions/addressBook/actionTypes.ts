import { TypeKeys } from './constants';

export interface AddressLabel {
  address: string;
  label: string;
}

export interface AddressLabelEntry extends AddressLabel {
  id: string;
  temporaryAddress?: string;
  addressError?: string;
  temporaryLabel?: string;
  labelError?: string;
  isEditing?: boolean;
  overrideValidation?: boolean;
}

export interface SetAddressLabel {
  type: TypeKeys.SET_ADDRESS_LABEL;
  payload: AddressLabel;
}

export interface ClearAddressLabel {
  type: TypeKeys.CLEAR_ADDRESS_LABEL;
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

export interface RemoveAddressLabelEntry {
  type: TypeKeys.REMOVE_ADDRESS_LABEL_ENTRY;
  payload: string;
}

export type AddressBookAction =
  | SetAddressLabel
  | ClearAddressLabel
  | SetAddressLabelEntry
  | ChangeAddressLabelEntry
  | SaveAddressLabelEntry
  | ClearAddressLabelEntry
  | RemoveAddressLabelEntry;
