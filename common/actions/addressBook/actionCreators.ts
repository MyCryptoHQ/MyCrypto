import { TypeKeys } from './constants';
import {
  AddressLabel,
  AddressLabelEntry,
  AddAddressLabel,
  RemoveAddressLabel,
  SetAddressLabelEntry,
  ChangeAddressLabelEntry,
  SaveAddressLabelEntry,
  ClearAddressLabelEntry
} from './actionTypes';

export type TAddAddressLabel = typeof addAddressLabel;
export function addAddressLabel(payload: AddressLabel): AddAddressLabel {
  return {
    type: TypeKeys.ADD_ADDRESS_LABEL,
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

export type TSetAddressLabelEntry = typeof setAddressLabelEntry;
export function setAddressLabelEntry(payload: AddressLabelEntry): SetAddressLabelEntry {
  return {
    type: TypeKeys.SET_ADDRESS_LABEL_ENTRY,
    payload
  };
}

export type TChangeAddressLabelEntry = typeof changeAddressLabelEntry;
export function changeAddressLabelEntry(payload: AddressLabelEntry): ChangeAddressLabelEntry {
  return {
    type: TypeKeys.CHANGE_ADDRESS_LABEL_ENTRY,
    payload
  };
}

export type TSaveAddressLabelEntry = typeof saveAddressLabelEntry;
export function saveAddressLabelEntry(payload: string): SaveAddressLabelEntry {
  return {
    type: TypeKeys.SAVE_ADDRESS_LABEL_ENTRY,
    payload
  };
}

export type TClearAddressLabelEntry = typeof clearAddressLabelEntry;
export function clearAddressLabelEntry(payload: string): ClearAddressLabelEntry {
  return {
    type: TypeKeys.CLEAR_ADDRESS_LABEL_ENTRY,
    payload
  };
}
