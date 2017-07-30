export type Pairs = {
  ETHBTC: number,
  ETHREP: number,
  BTCETH: number,
  BTCREP: number
};

export type OriginKindSwapAction = {
  type: 'SWAP_ORIGIN_KIND',
  value: string
};
export type DestinationKindSwapAction = {
  type: 'SWAP_DESTINATION_KIND',
  value: string
};
export type OriginAmountSwapAction = {
  type: 'SWAP_ORIGIN_AMOUNT',
  value: ?number
};
export type DestinationAmountSwapAction = {
  type: 'SWAP_DESTINATION_AMOUNT',
  value: ?number
};
export type LoadBityRatesSucceededSwapAction = {
  type: 'SWAP_LOAD_BITY_RATES_SUCCEEDED',
  value: Pairs
};
export type DestinationAddressSwapAction = {
  type: 'SWAP_DESTINATION_ADDRESS',
  value: ?number
};

export type RestartSwapAction = {
  type: 'SWAP_RESTART'
};

export type LoadBityRatesRequestedSwapAction = {
  type: 'SWAP_LOAD_BITY_RATES_REQUESTED'
};

export type ChangeStepSwapAction = {
  type: 'SWAP_STEP',
  value: number
};

export type StopLoadBityRatesSwapAction = {
  type: 'SWAP_STOP_LOAD_BITY_RATES'
};

export type BityOrderCreateRequestedSwapAction = {
  type: 'SWAP_ORDER_CREATE_REQUESTED',
  payload: {
    amount: number,
    destinationAddress: string,
    pair: string,
    mode: number
  }
};

type BityOrderInput = {
  amount: string
};

type BityOrderOutput = {
  amount: string
};

export type BityOrderResponse = {
  status: string
};

export type BityOrderPostResponse = BityOrderResponse & {
  payment_address: string,
  status: string,
  input: BityOrderInput,
  output: BityOrderOutput,
  timestamp_created: string,
  validFor: number
};

export type BityOrderCreateSucceededSwapAction = {
  type: 'SWAP_BITY_ORDER_CREATE_SUCCEEDED',
  payload: BityOrderPostResponse
};

export type OrderStatusRequestedSwapAction = {
  type: 'SWAP_BITY_ORDER_STATUS_REQUESTED',
  payload: BityOrderResponse
};

export type OrderStatusSucceededSwapAction = {
  type: 'SWAP_BITY_ORDER_STATUS_SUCCEEDED',
  payload: BityOrderResponse
};

export type StartOrderTimerSwapAction = {
  type: 'SWAP_ORDER_START_TIMER'
};

export type StopOrderTimerSwapAction = {
  type: 'SWAP_ORDER_STOP_TIMER'
};

export type StartPollBityOrderStatusAction = {
  type: 'SWAP_START_POLL_BITY_ORDER_STATUS'
};

export type StopPollBityOrderStatusAction = {
  type: 'SWAP_STOP_POLL_BITY_ORDER_STATUS'
};

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
