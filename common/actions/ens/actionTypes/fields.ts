import { TypeKeys } from '../constants';
import { Wei } from 'libs/units';

export interface SetBidValueFieldAction {
  type: TypeKeys.BID_VALUE_FIELD_SET;
  payload: {
    raw: string;
    value: null | Wei;
  };
}

export interface SetBidMaskFieldAction {
  type: TypeKeys.BID_MASK_FIELD_SET;
  payload: {
    raw: string;
    value: null | Wei;
  };
}

export interface SetSecretFieldAction {
  type: TypeKeys.SECRET_FIELD_SET;
  payload: {
    raw: string;
    value: null | string;
  };
}

export interface InputSecretFieldAction {
  type: TypeKeys.SECRET_FIELD_INPUT;
  payload: string;
}

export interface InputBidMaskFieldAction {
  type: TypeKeys.BID_MASK_FIELD_INPUT;
  payload: string;
}

export interface InputBidValueFieldAction {
  type: TypeKeys.BID_VALUE_FIELD_INPUT;
  payload: string;
}

export type FieldAction = SetBidValueFieldAction | SetBidMaskFieldAction | SetSecretFieldAction;
