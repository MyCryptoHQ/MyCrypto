import {
  ADDRESS_BOOK,
  AddressLabel,
  AddressLabelEntry,
  SetAddressLabel,
  ClearAddressLabel,
  SetAddressLabelEntry,
  ChangeAddressLabelEntry,
  SaveAddressLabelEntry,
  ClearAddressLabelEntry,
  RemoveAddressLabelEntry
} from './types';

export type TSetAddressLabel = typeof setAddressLabel;
export function setAddressLabel(payload: AddressLabel): SetAddressLabel {
  return {
    type: ADDRESS_BOOK.SET_LABEL,
    payload
  };
}

export type TClearAddressLabel = typeof clearAddressLabel;
export function clearAddressLabel(payload: string): ClearAddressLabel {
  return {
    type: ADDRESS_BOOK.CLEAR_LABEL,
    payload
  };
}

export type TSetAddressLabelEntry = typeof setAddressLabelEntry;
export function setAddressLabelEntry(payload: AddressLabelEntry): SetAddressLabelEntry {
  return {
    type: ADDRESS_BOOK.SET_LABEL_ENTRY,
    payload
  };
}

export type TChangeAddressLabelEntry = typeof changeAddressLabelEntry;
export function changeAddressLabelEntry(payload: AddressLabelEntry): ChangeAddressLabelEntry {
  return {
    type: ADDRESS_BOOK.CHANGE_LABEL_ENTRY,
    payload
  };
}

export type TSaveAddressLabelEntry = typeof saveAddressLabelEntry;
export function saveAddressLabelEntry(payload: string): SaveAddressLabelEntry {
  return {
    type: ADDRESS_BOOK.SAVE_LABEL_ENTRY,
    payload
  };
}

export type TClearAddressLabelEntry = typeof clearAddressLabelEntry;
export function clearAddressLabelEntry(payload: string): ClearAddressLabelEntry {
  return {
    type: ADDRESS_BOOK.CLEAR_LABEL_ENTRY,
    payload
  };
}

export type TRemoveAddressLabelEntry = typeof removeAddressLabelEntry;
export function removeAddressLabelEntry(payload: string): RemoveAddressLabelEntry {
  return {
    type: ADDRESS_BOOK.REMOVE_LABEL_ENTRY,
    payload
  };
}
