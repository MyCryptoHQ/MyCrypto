import { TypeKeys } from './constants';
import { ISignedMessage } from 'libs/signing';

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

/*** Union Type ***/
export type MessageAction =
  | SignMessageRequestedAction
  | SignLocalMessageSucceededAction
  | SignMessageFailedAction;
