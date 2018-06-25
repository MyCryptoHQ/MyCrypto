import * as types from './types';

export type TSetAddressLabel = typeof setAddressLabel;
export function setAddressLabel(payload: types.AddressLabel): types.SetAddressLabel {
  return {
    type: types.AddressBookActions.SET_LABEL,
    payload
  };
}

export type TClearAddressLabel = typeof clearAddressLabel;
export function clearAddressLabel(payload: types.AddressLabel['address']): types.ClearAddressLabel {
  return {
    type: types.AddressBookActions.CLEAR_LABEL,
    payload
  };
}

export type TSetAddressLabelEntry = typeof setAddressLabelEntry;
export function setAddressLabelEntry(payload: types.AddressLabelEntry): types.SetAddressLabelEntry {
  return {
    type: types.AddressBookActions.SET_LABEL_ENTRY,
    payload
  };
}

export type TChangeAddressLabelEntry = typeof changeAddressLabelEntry;
export function changeAddressLabelEntry(
  payload: types.AddressLabelEntry
): types.ChangeAddressLabelEntry {
  return {
    type: types.AddressBookActions.CHANGE_LABEL_ENTRY,
    payload
  };
}

export type TSaveAddressLabelEntry = typeof saveAddressLabelEntry;
export function saveAddressLabelEntry(
  payload: types.AddressLabelEntry['id']
): types.SaveAddressLabelEntry {
  return {
    type: types.AddressBookActions.SAVE_LABEL_ENTRY,
    payload
  };
}

export type TClearAddressLabelEntry = typeof clearAddressLabelEntry;
export function clearAddressLabelEntry(
  payload: types.AddressLabelEntry['id']
): types.ClearAddressLabelEntry {
  return {
    type: types.AddressBookActions.CLEAR_LABEL_ENTRY,
    payload
  };
}

export type TRemoveAddressLabelEntry = typeof removeAddressLabelEntry;
export function removeAddressLabelEntry(
  payload: types.AddressLabelEntry['id']
): types.RemoveAddressLabelEntry {
  return {
    type: types.AddressBookActions.REMOVE_LABEL_ENTRY,
    payload
  };
}
