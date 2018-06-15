import { TypeKeys } from './constants';
import {
  AddressLabel,
  AddressLabelEntry,
  SetAddressLabel,
  ClearAddressLabel,
  SetAddressLabelEntry,
  ChangeAddressLabelEntry,
  SaveAddressLabelEntry,
  ClearAddressLabelEntry,
  RemoveAddressLabelEntry
} from './actionTypes';

export type TSetAddressLabel = typeof setAddressLabel;
export function setAddressLabel(payload: AddressLabel): SetAddressLabel {
  return {
    type: TypeKeys.SET_ADDRESS_LABEL,
    payload
  };
}

export type TClearAddressLabel = typeof clearAddressLabel;
export function clearAddressLabel(payload: AddressLabel['address']): ClearAddressLabel {
  return {
    type: TypeKeys.CLEAR_ADDRESS_LABEL,
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
export function saveAddressLabelEntry(payload: AddressLabelEntry['id']): SaveAddressLabelEntry {
  return {
    type: TypeKeys.SAVE_ADDRESS_LABEL_ENTRY,
    payload
  };
}

export type TClearAddressLabelEntry = typeof clearAddressLabelEntry;
export function clearAddressLabelEntry(payload: AddressLabelEntry['id']): ClearAddressLabelEntry {
  return {
    type: TypeKeys.CLEAR_ADDRESS_LABEL_ENTRY,
    payload
  };
}

export type TRemoveAddressLabelEntry = typeof removeAddressLabelEntry;
export function removeAddressLabelEntry(payload: AddressLabelEntry['id']): RemoveAddressLabelEntry {
  return {
    type: TypeKeys.REMOVE_ADDRESS_LABEL_ENTRY,
    payload
  };
}
