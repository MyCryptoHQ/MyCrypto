import { ISignedMessage } from 'libs/signing';
import * as types from './types';

export type TSignMessageRequested = typeof signMessageRequested;
export function signMessageRequested(payload: string): types.SignMessageRequestedAction {
  return {
    type: types.MessageActions.SIGN_REQUESTED,
    payload
  };
}

export type TSignLocalMessageSucceeded = typeof signLocalMessageSucceeded;
export function signLocalMessageSucceeded(
  payload: ISignedMessage
): types.SignLocalMessageSucceededAction {
  return {
    type: types.MessageActions.SIGN_LOCAL_SUCCEEDED,
    payload
  };
}

export type TSignMessageFailed = typeof signMessageFailed;
export function signMessageFailed(): types.SignMessageFailedAction {
  return {
    type: types.MessageActions.SIGN_FAILED
  };
}
