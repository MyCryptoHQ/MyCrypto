import { TypeKeys, AddLabelForAddressAction, RemoveLabelForAddressAction } from './types';

export type TAddLabelForAddress = typeof addLabelForAddress;
function addLabelForAddress(
  payload: AddLabelForAddressAction['payload']
): AddLabelForAddressAction {
  return {
    type: TypeKeys.ADD_LABEL_FOR_ADDRESS,
    payload
  };
}

export type TRemoveLabelForAddress = typeof removeLabelForAddress;
function removeLabelForAddress(
  payload: RemoveLabelForAddressAction['payload']
): RemoveLabelForAddressAction {
  return {
    type: TypeKeys.REMOVE_LABEL_FOR_ADDRESS,
    payload
  };
}

export default {
  addLabelForAddress,
  removeLabelForAddress
};
