import { ISignedMessage } from 'libs/signing';

export enum MessageActions {
  SIGN_REQUESTED = 'MESSAGE_SIGN_REQUESTED',
  SIGN_LOCAL_SUCCEEDED = 'MESSAGE_SIGN_LOCAL_SUCCEEDED',
  SIGN_FAILED = 'MESSAGE_SIGN_FAILED'
}

export interface MessageState {
  signed?: ISignedMessage | null;
}

export interface SignMessageRequestedAction {
  type: MessageActions.SIGN_REQUESTED;
  payload: string;
}

export interface SignLocalMessageSucceededAction {
  type: MessageActions.SIGN_LOCAL_SUCCEEDED;
  payload: ISignedMessage;
}

export interface SignMessageFailedAction {
  type: MessageActions.SIGN_FAILED;
}

export type MessageAction =
  | SignMessageRequestedAction
  | SignLocalMessageSucceededAction
  | SignMessageFailedAction;
