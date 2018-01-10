import { SetBidFieldAction, SetBidMaskFieldAction, SetSecretFieldAction } from '../actionTypes';
import { TypeKeys } from '../constants';

export type TSetBidField = typeof setBidField;
export const setBidField = (payload: SetBidFieldAction['payload']): SetBidFieldAction => ({
  type: TypeKeys.BID_FIELD_SET,
  payload
});

export type TSetBidMaskField = typeof setBidMaskField;
export const setBidMaskField = (
  payload: SetBidMaskFieldAction['payload']
): SetBidMaskFieldAction => ({
  type: TypeKeys.BID_MASK_FIELD_SET,
  payload
});

export type TSetSecretField = typeof setSecretField;
export const setSecretField = (payload: SetSecretFieldAction['payload']): SetSecretFieldAction => ({
  type: TypeKeys.SECRET_FIELD_SET,
  payload
});
