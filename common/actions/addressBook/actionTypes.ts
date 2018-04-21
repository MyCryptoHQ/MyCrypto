export interface AddressLabelPair {
  address: string;
  label: string;
}

export interface AddLabelForAddressAction {
  type: 'ADD_LABEL_FOR_ADDRESS';
  payload: AddressLabelPair;
}

export interface RemoveLabelForAddressAction {
  type: 'REMOVE_LABEL_FOR_ADDRESS';
  payload: string;
}

export type AddressBookAction = AddLabelForAddressAction | RemoveLabelForAddressAction;
