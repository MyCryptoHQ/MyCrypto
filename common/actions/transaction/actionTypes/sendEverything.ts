import { TypeKeys } from 'actions/transaction';
export {
  SendEverythingAction,
  SendEverythingSucceededAction,
  SendEverythingFailedAction,
  SendEverythingRequestedAction
};

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
