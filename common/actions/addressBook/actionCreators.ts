import { AddLabelForAddressAction, RemoveLabelForAddressAction } from './actionTypes';
import { TypeKeys } from './constants';

export type TAddLabelForAddress = typeof addLabelForAddress;
export function addLabelForAddress(
  payload: AddLabelForAddressAction['payload']
): AddLabelForAddressAction {
  return {
    type: TypeKeys.ADD_LABEL_FOR_ADDRESS,
    payload
  };
}

export type TRemoveLabelForAddress = typeof removeLabelForAddress;
export function removeLabelForAddress(
  payload: RemoveLabelForAddressAction['payload']
): RemoveLabelForAddressAction {
  return {
    type: TypeKeys.REMOVE_LABEL_FOR_ADDRESS,
    payload
  };
}
