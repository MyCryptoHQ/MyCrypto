import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';

export function addLabelForAddress({
  address,
  label
}: interfaces.AddressLabelPair): interfaces.AddLabelForAddressAction {
  return {
    type: TypeKeys.ADD_LABEL_FOR_ADDRESS,
    payload: {
      address,
      label
    }
  };
}

export function removeLabelForAddress(address: string): interfaces.RemoveLabelForAddressAction {
  return {
    type: TypeKeys.REMOVE_LABEL_FOR_ADDRESS,
    payload: address
  };
}
