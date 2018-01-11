import {
  SetBidValueFieldAction,
  SetBidMaskFieldAction,
  SetSecretFieldAction
} from '../actionTypes';
import { TypeKeys } from '../constants';
import {
  InputSecretFieldAction,
  InputBidMaskFieldAction,
  InputBidValueFieldAction
} from 'actions/ens';

export type TSetBidValueField = typeof setBidValueField;
export const setBidValueField = (
  payload: SetBidValueFieldAction['payload']
): SetBidValueFieldAction => ({
  type: TypeKeys.BID_VALUE_FIELD_SET,
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

export type TInputSecretField = typeof inputSecretField;
export const inputSecretField = (
  payload: InputSecretFieldAction['payload']
): InputSecretFieldAction => ({ type: TypeKeys.SECRET_FIELD_INPUT, payload });

export type TInputBidMaskField = typeof inputBidMaskField;
export const inputBidMaskField = (
  payload: InputBidMaskFieldAction['payload']
): InputBidMaskFieldAction => ({ type: TypeKeys.BID_MASK_FIELD_INPUT, payload });

export type TInputBidValueField = typeof inputBidValueField;
export const inputBidValueField = (
  payload: InputBidValueFieldAction['payload']
): InputBidValueFieldAction => ({ payload, type: TypeKeys.BID_VALUE_FIELD_INPUT });
