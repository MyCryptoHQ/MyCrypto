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

export type OrderCreateRequestedSwapAction = {
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
  output: BityOrderOutput
};

export type OrderCreateSucceededSwapAction = {
  type: 'SWAP_ORDER_CREATE_SUCCEEDED',
  payload: BityOrderPostResponse
};

export type OrderStatusSucceededSwapAction = {
  type: 'SWAP_BITY_ORDER_STATUS_SUCCEEDED',
  payload: BityOrderResponse
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
  | OrderCreateRequestedSwapAction
  | OrderCreateSucceededSwapAction
  | BityOrderResponse
  | OrderStatusSucceededSwapAction;
