import { TypeKeys } from 'actions/transaction';

interface SendEverythingRequestedAction {
  type: TypeKeys.SEND_EVERYTHING_REQUESTED;
}
interface SendEverythingSucceededAction {
  type: TypeKeys.SEND_EVERYTHING_SUCCEEDED;
}
interface SendEverythingFailedAction {
  type: TypeKeys.SEND_EVERYTHING_FAILED;
}

type SendEverythingAction =
  | SendEverythingRequestedAction
  | SendEverythingSucceededAction
  | SendEverythingFailedAction;

export {
  SendEverythingAction,
  SendEverythingSucceededAction,
  SendEverythingFailedAction,
  SendEverythingRequestedAction
};
