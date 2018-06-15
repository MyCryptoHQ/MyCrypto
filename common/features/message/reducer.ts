import * as messageTypes from './types';

export const INITIAL_STATE: messageTypes.MessageState = {
  signed: null
};

function signLocalMessageSucceeded(
  state: messageTypes.MessageState,
  action: messageTypes.SignLocalMessageSucceededAction
): messageTypes.MessageState {
  return {
    ...state,
    signed: action.payload
  };
}

function signMessageFailed(state: messageTypes.MessageState): messageTypes.MessageState {
  return {
    ...state,
    signed: null
  };
}

export function messageReducer(
  state: messageTypes.MessageState = INITIAL_STATE,
  action: messageTypes.MessageAction
): messageTypes.MessageState {
  switch (action.type) {
    case messageTypes.MessageActions.SIGN_LOCAL_SUCCEEDED:
      return signLocalMessageSucceeded(state, action);
    case messageTypes.MessageActions.SIGN_FAILED:
      return signMessageFailed(state);
    default:
      return state;
  }
}
