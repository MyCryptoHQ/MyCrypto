import { ISignedMessage } from 'libs/signing';
import * as messageTypes from './types';

export type TSignMessageRequested = typeof signMessageRequested;
export function signMessageRequested(payload: string): messageTypes.SignMessageRequestedAction {
  return {
    type: messageTypes.MessageActions.SIGN_REQUESTED,
    payload
  };
}

export type TSignLocalMessageSucceeded = typeof signLocalMessageSucceeded;
export function signLocalMessageSucceeded(
  payload: ISignedMessage
): messageTypes.SignLocalMessageSucceededAction {
  return {
    type: messageTypes.MessageActions.SIGN_LOCAL_SUCCEEDED,
    payload
  };
}

export type TSignMessageFailed = typeof signMessageFailed;
export function signMessageFailed(): messageTypes.SignMessageFailedAction {
  return {
    type: messageTypes.MessageActions.SIGN_FAILED
  };
}
