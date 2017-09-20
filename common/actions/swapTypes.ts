export interface Pairs {
  ETHBTC: number;
  ETHREP: number;
  BTCETH: number;
  BTCREP: number;
}

export interface OriginKindSwapAction {
  type: 'SWAP_ORIGIN_KIND';
  value: string;
}
export interface DestinationKindSwapAction {
  type: 'SWAP_DESTINATION_KIND';
  value: string;
}
export interface OriginAmountSwapAction {
  type: 'SWAP_ORIGIN_AMOUNT';
  value?: number;
}
export interface DestinationAmountSwapAction {
  type: 'SWAP_DESTINATION_AMOUNT';
  value?: number;
}
export interface LoadBityRatesSucceededSwapAction {
  type: 'SWAP_LOAD_BITY_RATES_SUCCEEDED';
  value: Pairs;
}
export interface DestinationAddressSwapAction {
  type: 'SWAP_DESTINATION_ADDRESS';
  value?: string;
}

export interface RestartSwapAction {
  type: 'SWAP_RESTART';
}

export interface LoadBityRatesRequestedSwapAction {
  type: 'SWAP_LOAD_BITY_RATES_REQUESTED';
}

export interface ChangeStepSwapAction {
  type: 'SWAP_STEP';
  value: number;
}

export interface StopLoadBityRatesSwapAction {
  type: 'SWAP_STOP_LOAD_BITY_RATES';
}

export interface BityOrderCreateRequestedSwapAction {
  type: 'SWAP_ORDER_CREATE_REQUESTED';
  payload: {
    amount: number;
    destinationAddress: string;
    pair: string;
    mode: number;
  };
}

interface BityOrderInput {
  amount: string;
}

interface BityOrderOutput {
  amount: string;
}

export interface BityOrderResponse {
  status: string;
}

export type BityOrderPostResponse = BityOrderResponse & {
  payment_address: string;
  status: string;
  input: BityOrderInput;
  output: BityOrderOutput;
  timestamp_created: string;
  validFor: number;
};

export interface BityOrderCreateSucceededSwapAction {
  type: 'SWAP_BITY_ORDER_CREATE_SUCCEEDED';
  payload: BityOrderPostResponse;
}

export interface OrderStatusRequestedSwapAction {
  type: 'SWAP_BITY_ORDER_STATUS_REQUESTED';
}

export interface OrderStatusSucceededSwapAction {
  type: 'SWAP_BITY_ORDER_STATUS_SUCCEEDED';
  payload: BityOrderResponse;
}

export interface StartOrderTimerSwapAction {
  type: 'SWAP_ORDER_START_TIMER';
}

export interface StopOrderTimerSwapAction {
  type: 'SWAP_ORDER_STOP_TIMER';
}

export interface StartPollBityOrderStatusAction {
  type: 'SWAP_START_POLL_BITY_ORDER_STATUS';
}

export interface StopPollBityOrderStatusAction {
  type: 'SWAP_STOP_POLL_BITY_ORDER_STATUS';
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
  | BityOrderResponse
  | OrderStatusSucceededSwapAction
  | StartPollBityOrderStatusAction;
