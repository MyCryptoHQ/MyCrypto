import * as addressBookTypes from './types';

export type TSetAddressLabel = typeof setAddressLabel;
export function setAddressLabel(
  payload: addressBookTypes.AddressLabel
): addressBookTypes.SetAddressLabel {
  return {
    type: addressBookTypes.AddressBookActions.SET_LABEL,
    payload
  };
}

export type TClearAddressLabel = typeof clearAddressLabel;
export function clearAddressLabel(payload: string): addressBookTypes.ClearAddressLabel {
  return {
    type: addressBookTypes.AddressBookActions.CLEAR_LABEL,
    payload
  };
}

export type TSetAddressLabelEntry = typeof setAddressLabelEntry;
export function setAddressLabelEntry(
  payload: addressBookTypes.AddressLabelEntry
): addressBookTypes.SetAddressLabelEntry {
  return {
    type: addressBookTypes.AddressBookActions.SET_LABEL_ENTRY,
    payload
  };
}

export type TChangeAddressLabelEntry = typeof changeAddressLabelEntry;
export function changeAddressLabelEntry(
  payload: addressBookTypes.AddressLabelEntry
): addressBookTypes.ChangeAddressLabelEntry {
  return {
    type: addressBookTypes.AddressBookActions.CHANGE_LABEL_ENTRY,
    payload
  };
}

export type TSaveAddressLabelEntry = typeof saveAddressLabelEntry;
export function saveAddressLabelEntry(payload: string): addressBookTypes.SaveAddressLabelEntry {
  return {
    type: addressBookTypes.AddressBookActions.SAVE_LABEL_ENTRY,
    payload
  };
}

export type TClearAddressLabelEntry = typeof clearAddressLabelEntry;
export function clearAddressLabelEntry(payload: string): addressBookTypes.ClearAddressLabelEntry {
  return {
    type: addressBookTypes.AddressBookActions.CLEAR_LABEL_ENTRY,
    payload
  };
}

export type TRemoveAddressLabelEntry = typeof removeAddressLabelEntry;
export function removeAddressLabelEntry(payload: string): addressBookTypes.RemoveAddressLabelEntry {
  return {
    type: addressBookTypes.AddressBookActions.REMOVE_LABEL_ENTRY,
    payload
  };
}
