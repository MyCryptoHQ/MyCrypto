export interface AddressBookState {
  addresses: {
    [address: string]: string;
  };
  labels: {
    [labels: string]: string;
  };
  entries: {
    [id: string]: AddressLabelEntry;
  };
}

export enum AddressBookActions {
  SET_LABEL = 'ADDRESS_BOOK_SET_LABEL',
  CLEAR_LABEL = 'ADDRESS_BOOK_CLEAR_LABEL',
  SET_LABEL_ENTRY = 'ADDRESS_BOOK_SET_LABEL_ENTRY',
  CHANGE_LABEL_ENTRY = 'ADDRESS_BOOK_CHANGE_LABEL_ENTRY',
  SAVE_LABEL_ENTRY = 'ADDRESS_BOOK_SAVE_LABEL_ENTRY',
  CLEAR_LABEL_ENTRY = 'ADDRESS_BOOK_CLEAR_LABEL_ENTRY',
  REMOVE_LABEL_ENTRY = 'ADDRESS_BOOK_REMOVE_LABEL_ENTRY'
}

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
  type: AddressBookActions.SET_LABEL;
  payload: AddressLabel;
}

export interface ClearAddressLabel {
  type: AddressBookActions.CLEAR_LABEL;
  payload: string;
}

export interface SetAddressLabelEntry {
  type: AddressBookActions.SET_LABEL_ENTRY;
  payload: AddressLabelEntry;
}

export interface ChangeAddressLabelEntry {
  type: AddressBookActions.CHANGE_LABEL_ENTRY;
  payload: AddressLabelEntry;
}

export interface SaveAddressLabelEntry {
  type: AddressBookActions.SAVE_LABEL_ENTRY;
  payload: string;
}

export interface ClearAddressLabelEntry {
  type: AddressBookActions.CLEAR_LABEL_ENTRY;
  payload: string;
}

export interface RemoveAddressLabelEntry {
  type: AddressBookActions.REMOVE_LABEL_ENTRY;
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
