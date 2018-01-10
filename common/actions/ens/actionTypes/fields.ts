import { TypeKeys } from '../constants';
import { Wei } from 'libs/units';

export interface SetBidFieldAction {
  type: TypeKeys.BID_FIELD_SET;
  payload: Wei | null;
}

export interface SetBidMaskFieldAction {
  type: TypeKeys.BID_MASK_FIELD_SET;
  payload: string | null;
}

export interface SetSecretFieldAction {
  type: TypeKeys.SECRET_FIELD_SET;
  payload: string | null;
}

export type FieldAction = SetBidFieldAction | SetBidMaskFieldAction | SetSecretFieldAction;
