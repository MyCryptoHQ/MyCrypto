import { TypeKeys } from './constants';
export interface Pairs {
  ETHBTC: number;
  ETHREP: number;
  BTCETH: number;
  BTCREP: number;
}

export interface OriginKindSwapAction {
  type: TypeKeys.SWAP_ORIGIN_KIND;
  payload: string;
}

export interface DestinationKindSwapAction {
  type: TypeKeys.SWAP_DESTINATION_KIND;
  payload: string;
}

export interface OriginAmountSwapAction {
  type: TypeKeys.SWAP_ORIGIN_AMOUNT;
  payload?: number | null;
}

export interface DestinationAmountSwapAction {
  type: TypeKeys.SWAP_DESTINATION_AMOUNT;
  payload?: number | null;
}

export interface LoadBityRatesSucceededSwapAction {
  type: TypeKeys.SWAP_LOAD_BITY_RATES_SUCCEEDED;
  payload: Pairs;
}

export interface DestinationAddressSwapAction {
  type: TypeKeys.SWAP_DESTINATION_ADDRESS;
  payload?: string;
}

export interface RestartSwapAction {
  type: TypeKeys.SWAP_RESTART;
}

export interface LoadBityRatesRequestedSwapAction {
  type: TypeKeys.SWAP_LOAD_BITY_RATES_REQUESTED;
  payload?: null;
}

export interface ChangeStepSwapAction {
  type: TypeKeys.SWAP_STEP;
  payload: number;
}

export interface StopLoadBityRatesSwapAction {
  type: TypeKeys.SWAP_STOP_LOAD_BITY_RATES;
}

export interface OrderSwapTimeSwapAction {
  type: TypeKeys.SWAP_ORDER_TIME;
  payload: number;
}

export interface BityOrderCreateRequestedSwapAction {
  type: TypeKeys.SWAP_ORDER_CREATE_REQUESTED;
  payload: {
    amount: number;
    destinationAddress: string;
    pair: string;
    mode: number;
  };
}

interface BityOrderInput {
  amount: string;
  currency: string;
  reference: string;
  status: string;
}

interface BityOrderOutput {
  amount: string;
  currency: string;
  reference: string;
  status: string;
}

export interface BityOrderResponse {
  input: BityOrderInput;
  output: BityOrderOutput;
  status: string;
}

export type BityOrderPostResponse = BityOrderResponse & {
  payment_address: string;
  status: string;
  input: BityOrderInput;
  output: BityOrderOutput;
  timestamp_created: string;
  validFor: number;
  id: string;
};

export interface BityOrderCreateSucceededSwapAction {
  type: TypeKeys.SWAP_BITY_ORDER_CREATE_SUCCEEDED;
  payload: BityOrderPostResponse;
}

export interface BityOrderCreateFailedSwapAction {
  type: TypeKeys.SWAP_ORDER_CREATE_FAILED;
}
export interface OrderStatusRequestedSwapAction {
  type: TypeKeys.SWAP_BITY_ORDER_STATUS_REQUESTED;
}

export interface OrderStatusSucceededSwapAction {
  type: TypeKeys.SWAP_BITY_ORDER_STATUS_SUCCEEDED;
  payload: BityOrderResponse;
}

export interface StartOrderTimerSwapAction {
  type: TypeKeys.SWAP_ORDER_START_TIMER;
}

export interface StopOrderTimerSwapAction {
  type: TypeKeys.SWAP_ORDER_STOP_TIMER;
}

export interface StartPollBityOrderStatusAction {
  type: TypeKeys.SWAP_START_POLL_BITY_ORDER_STATUS;
}

export interface StopPollBityOrderStatusAction {
  type: TypeKeys.SWAP_STOP_POLL_BITY_ORDER_STATUS;
}

/*** Action Type Union ***/
export type SwapAction =
  | ChangeStepSwapAction
  | OriginKindSwapAction
  | DestinationKindSwapAction
  | OriginAmountSwapAction
  | DestinationAmountSwapAction
  | LoadBityRatesSucceededSwapAction
  | DestinationAddressSwapAction
  | RestartSwapAction
  | LoadBityRatesRequestedSwapAction
  | StopLoadBityRatesSwapAction
  | BityOrderCreateRequestedSwapAction
  | BityOrderCreateSucceededSwapAction
  | OrderStatusSucceededSwapAction
  | StartPollBityOrderStatusAction
  | BityOrderCreateFailedSwapAction
  | OrderSwapTimeSwapAction;
