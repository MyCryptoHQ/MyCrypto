export enum TypeKeys {
  ADD_LABEL_FOR_ADDRESS = 'ADD_LABEL_FOR_ADDRESS',
  REMOVE_LABEL_FOR_ADDRESS = 'REMOVE_LABEL_FOR_ADDRESS'
}

interface AddressLabelPair {
  address: string;
  label: string;
}

export interface AddLabelForAddressAction {
  type: TypeKeys.ADD_LABEL_FOR_ADDRESS;
  payload: AddressLabelPair;
}

export interface RemoveLabelForAddressAction {
  type: TypeKeys.REMOVE_LABEL_FOR_ADDRESS;
  payload: string;
}

export type AddressBookAction = AddLabelForAddressAction | RemoveLabelForAddressAction;
