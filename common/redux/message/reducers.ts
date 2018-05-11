import { ISignedMessage } from 'libs/signing';
import { TypeKeys, MessageAction, SignLocalMessageSucceededAction } from './types';

export interface State {
  signed?: ISignedMessage | null;
}

export const INITIAL_STATE: State = {
  signed: null
};

function signLocalMessageSucceeded(state: State, action: SignLocalMessageSucceededAction): State {
  return {
    ...state,
    signed: action.payload
  };
}

function signMessageFailed(state: State): State {
  return {
    ...state,
    signed: null
  };
}

export default function message(state: State = INITIAL_STATE, action: MessageAction): State {
  switch (action.type) {
    case TypeKeys.SIGN_LOCAL_MESSAGE_SUCCEEDED:
      return signLocalMessageSucceeded(state, action);
    case TypeKeys.SIGN_MESSAGE_FAILED:
      return signMessageFailed(state);
    default:
      return state;
  }
}
