import { ISignedMessage } from 'libs/signing';
import {
  TypeKeys,
  SignMessageRequestedAction,
  SignLocalMessageSucceededAction,
  SignMessageFailedAction
} from './types';

export type TSignMessageRequested = typeof signMessageRequested;
export function signMessageRequested(payload: string): SignMessageRequestedAction {
  return {
    type: TypeKeys.SIGN_MESSAGE_REQUESTED,
    payload
  };
}

export type TSignLocalMessageSucceeded = typeof signLocalMessageSucceeded;
export function signLocalMessageSucceeded(
  payload: ISignedMessage
): SignLocalMessageSucceededAction {
  return {
    type: TypeKeys.SIGN_LOCAL_MESSAGE_SUCCEEDED,
    payload
  };
}

export type TSignMessageFailed = typeof signMessageFailed;
export function signMessageFailed(): SignMessageFailedAction {
  return {
    type: TypeKeys.SIGN_MESSAGE_FAILED
  };
}
