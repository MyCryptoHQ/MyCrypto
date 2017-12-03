import { TypeKeys } from 'actions/transaction/constants';
import { IHexStrTransaction } from 'libs/transaction';
export {
  EstimateGasRequestedAction,
  EstimateGasSucceededAction,
  EstimateGasFailedAction,
  GetFromRequestedAction,
  GetFromSucceededAction,
  GetFromFailedAction,
  NetworkAction
};
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

type NetworkAction =
  | EstimateGasFailedAction
  | EstimateGasRequestedAction
  | EstimateGasSucceededAction
  | GetFromRequestedAction
  | GetFromSucceededAction
  | GetFromFailedAction;
