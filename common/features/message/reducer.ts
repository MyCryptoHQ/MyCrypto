import { MESSAGE, MessageAction, SignLocalMessageSucceededAction, MessageState } from './types';

export const INITIAL_STATE: MessageState = {
  signed: null
};

function signLocalMessageSucceeded(
  state: MessageState,
  action: SignLocalMessageSucceededAction
): MessageState {
  return {
    ...state,
    signed: action.payload
  };
}

function signMessageFailed(state: MessageState): MessageState {
  return {
    ...state,
    signed: null
  };
}

export function messageReducer(
  state: MessageState = INITIAL_STATE,
  action: MessageAction
): MessageState {
  switch (action.type) {
    case MESSAGE.SIGN_LOCAL_SUCCEEDED:
      return signLocalMessageSucceeded(state, action);
    case MESSAGE.SIGN_FAILED:
      return signMessageFailed(state);
    default:
      return state;
  }
}
