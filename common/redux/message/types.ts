import { ISignedMessage } from 'libs/signing';

export enum TypeKeys {
  SIGN_MESSAGE_REQUESTED = 'SIGN_MESSAGE_REQUESTED',
  SIGN_LOCAL_MESSAGE_SUCCEEDED = 'SIGN_LOCAL_MESSAGE_SUCCEEDED',
  SIGN_MESSAGE_FAILED = 'SIGN_MESSAGE_FAILED'
}

export interface SignMessageRequestedAction {
  type: TypeKeys.SIGN_MESSAGE_REQUESTED;
  payload: string;
}

export interface SignLocalMessageSucceededAction {
  type: TypeKeys.SIGN_LOCAL_MESSAGE_SUCCEEDED;
  payload: ISignedMessage;
}

export interface SignMessageFailedAction {
  type: TypeKeys.SIGN_MESSAGE_FAILED;
}

export type MessageAction =
  | SignMessageRequestedAction
  | SignLocalMessageSucceededAction
  | SignMessageFailedAction;
