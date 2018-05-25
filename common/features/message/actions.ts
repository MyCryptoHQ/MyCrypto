import { ISignedMessage } from 'libs/signing';
import {
  MESSAGE,
  SignMessageRequestedAction,
  SignLocalMessageSucceededAction,
  SignMessageFailedAction
} from './types';

export type TSignMessageRequested = typeof signMessageRequested;
export function signMessageRequested(payload: string): SignMessageRequestedAction {
  return {
    type: MESSAGE.SIGN_REQUESTED,
    payload
  };
}

export type TSignLocalMessageSucceeded = typeof signLocalMessageSucceeded;
export function signLocalMessageSucceeded(
  payload: ISignedMessage
): SignLocalMessageSucceededAction {
  return {
    type: MESSAGE.SIGN_LOCAL_SUCCEEDED,
    payload
  };
}

export type TSignMessageFailed = typeof signMessageFailed;
export function signMessageFailed(): SignMessageFailedAction {
  return {
    type: MESSAGE.SIGN_FAILED
  };
}
