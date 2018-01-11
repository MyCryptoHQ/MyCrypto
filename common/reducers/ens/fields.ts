import { Reducer } from 'redux';
import {
  TypeKeys,
  SetBidValueFieldAction,
  SetBidMaskFieldAction,
  SetSecretFieldAction,
  FieldAction
} from 'actions/ens';

export interface State {
  bidValue: SetBidValueFieldAction['payload'];
  bidMask: SetBidMaskFieldAction['payload'];
  secretPhrase: SetSecretFieldAction['payload'];
}

const INITIAL_STATE: State = {
  bidValue: {
    raw: '',
    value: null
  },
  bidMask: {
    raw: '',
    value: null
  },
  secretPhrase: {
    raw: '',
    value: null
  }
};

const updateField = (key: keyof State): Reducer<State> => (state: State, action: FieldAction) => {
  return {
    ...state,
    [key]: action.payload
  };
};

export default (state: State = INITIAL_STATE, action: FieldAction): State => {
  switch (action.type) {
    case TypeKeys.BID_VALUE_FIELD_SET:
      return updateField('bidValue')(state, action);
    case TypeKeys.BID_MASK_FIELD_SET:
      return updateField('bidMask')(state, action);
    case TypeKeys.SECRET_FIELD_SET:
      return updateField('secretPhrase')(state, action);
    default:
      return state;
  }
};
