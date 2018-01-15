import { TypeKeys } from 'actions/transaction/constants';
import { IHexStrTransaction } from 'libs/transaction';
/* Network actions */
interface EstimateGasRequestedAction {
  type: TypeKeys.ESTIMATE_GAS_REQUESTED;
  payload: Partial<IHexStrTransaction>;
}
interface EstimateGasSucceededAction {
  type: TypeKeys.ESTIMATE_GAS_SUCCEEDED;
}
interface EstimateGasFailedAction {
  type: TypeKeys.ESTIMATE_GAS_FAILED;
}
interface EstimateGasTimeoutAction {
  type: TypeKeys.ESTIMATE_GAS_TIMEDOUT;
}
interface GetFromRequestedAction {
  type: TypeKeys.GET_FROM_REQUESTED;
}
interface GetFromSucceededAction {
  type: TypeKeys.GET_FROM_SUCCEEDED;
  payload: string;
}
interface GetFromFailedAction {
  type: TypeKeys.GET_FROM_FAILED;
}
interface GetNonceRequestedAction {
  type: TypeKeys.GET_NONCE_REQUESTED;
}
interface GetNonceSucceededAction {
  type: TypeKeys.GET_NONCE_SUCCEEDED;
  payload: string;
}
interface GetNonceFailedAction {
  type: TypeKeys.GET_NONCE_FAILED;
}

type NetworkAction =
  | EstimateGasFailedAction
  | EstimateGasRequestedAction
  | EstimateGasSucceededAction
  | EstimateGasTimeoutAction
  | GetFromRequestedAction
  | GetFromSucceededAction
  | GetFromFailedAction
  | GetNonceRequestedAction
  | GetNonceSucceededAction
  | GetNonceFailedAction;

export {
  EstimateGasRequestedAction,
  EstimateGasSucceededAction,
  EstimateGasFailedAction,
  EstimateGasTimeoutAction,
  GetFromRequestedAction,
  GetFromSucceededAction,
  GetFromFailedAction,
  GetNonceRequestedAction,
  GetNonceSucceededAction,
  GetNonceFailedAction,
  NetworkAction
};
