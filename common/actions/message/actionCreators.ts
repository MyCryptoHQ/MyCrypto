import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';
import { ISignedMessage } from 'libs/signing';

export type TSignMessageRequested = typeof signMessageRequested;
export function signMessageRequested(payload: string): interfaces.SignMessageRequestedAction {
  return {
    type: TypeKeys.SIGN_MESSAGE_REQUESTED,
    payload
  };
}

export type TSignLocalMessageSucceeded = typeof signLocalMessageSucceeded;
export function signLocalMessageSucceeded(
  payload: ISignedMessage
): interfaces.SignLocalMessageSucceededAction {
  return {
    type: TypeKeys.SIGN_LOCAL_MESSAGE_SUCCEEDED,
    payload
  };
}

export type TSignMessageFailed = typeof signMessageFailed;
export function signMessageFailed(): interfaces.SignMessageFailedAction {
  return {
    type: TypeKeys.SIGN_MESSAGE_FAILED
  };
}
