import * as types from './types';

export const INITIAL_STATE: types.MessageState = {
  signed: null
};

function signLocalMessageSucceeded(
  state: types.MessageState,
  action: types.SignLocalMessageSucceededAction
): types.MessageState {
  return {
    ...state,
    signed: action.payload
  };
}

function signMessageFailed(state: types.MessageState): types.MessageState {
  return {
    ...state,
    signed: null
  };
}

function resetMessage(): types.MessageState {
  return {
    ...INITIAL_STATE
  };
}

export function messageReducer(
  state: types.MessageState = INITIAL_STATE,
  action: types.MessageAction
): types.MessageState {
  switch (action.type) {
    case types.MessageActions.SIGN_LOCAL_SUCCEEDED:
      return signLocalMessageSucceeded(state, action);
    case types.MessageActions.SIGN_FAILED:
      return signMessageFailed(state);
    case types.MessageActions.RESET:
      return resetMessage();
    default:
      return state;
  }
}
