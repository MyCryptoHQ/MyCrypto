import { Reducer } from 'redux';
import {
  TypeKeys,
  SetBidFieldAction,
  SetBidMaskFieldAction,
  SetSecretFieldAction,
  FieldAction
} from 'actions/ens';

export interface State {
  bid: SetBidFieldAction['payload'];
  bidMask: SetBidMaskFieldAction['payload'];
  secret: SetSecretFieldAction['payload'];
}

const INITIAL_STATE: State = {
  bid: null,
  bidMask: null,
  secret: null
};

const updateField = (key: keyof State): Reducer<State> => (state: State, action: FieldAction) => {
  return {
    ...state,
    [key]: action.payload
  };
};

export default (state: State = INITIAL_STATE, action: FieldAction): State => {
  switch (action.type) {
    case TypeKeys.BID_FIELD_SET:
      return updateField('bid')(state, action);
    case TypeKeys.BID_MASK_FIELD_SET:
      return updateField('bidMask')(state, action);
    case TypeKeys.SECRET_FIELD_SET:
      return updateField('secret')(state, action);
    default:
      return state;
  }
};
