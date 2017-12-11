import {
  SendEverythingFailedAction,
  SendEverythingRequestedAction,
  SendEverythingSucceededAction
} from '../actionTypes/sendEverything';
import { TypeKeys } from 'actions/transaction';
export {
  TSendEverythingRequested,
  TSendEverythingFailed,
  TSendEverythingSucceeded,
  sendEverythingRequested,
  sendEverythingFailed,
  sendEverythingSucceeded
};

type TSendEverythingRequested = typeof sendEverythingRequested;
const sendEverythingRequested = (): SendEverythingRequestedAction => ({
  type: TypeKeys.SEND_EVERYTHING_REQUESTED
});

type TSendEverythingFailed = typeof sendEverythingFailed;
const sendEverythingFailed = (): SendEverythingFailedAction => ({
  type: TypeKeys.SEND_EVERYTHING_FAILED
});

type TSendEverythingSucceeded = typeof sendEverythingSucceeded;
const sendEverythingSucceeded = (): SendEverythingSucceededAction => ({
  type: TypeKeys.SEND_EVERYTHING_SUCCEEDED
});
