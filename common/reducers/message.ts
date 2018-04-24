import { MessageAction, SignLocalMessageSucceededAction, TypeKeys } from 'actions/message';
import { ISignedMessage } from 'libs/signing';

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

export function message(state: State = INITIAL_STATE, action: MessageAction): State {
  switch (action.type) {
    case TypeKeys.SIGN_LOCAL_MESSAGE_SUCCEEDED:
      return signLocalMessageSucceeded(state, action);
    default:
      return state;
  }
}
