// @flow

/*** Change Step ***/
export type ChangeStepSwapAction = {
  type: 'SWAP_STEP',
  value: number
};

export function changeStepSwap(value: number): ChangeStepSwapAction {
  return {
    type: 'SWAP_STEP',
    value
  };
}

/*** Change Reference Number ***/
export type ReferenceNumberSwapAction = {
  type: 'SWAP_REFERENCE_NUMBER',
  value: string
};

export function referenceNumberSwap(value: string): ReferenceNumberSwapAction {
  return {
    type: 'SWAP_REFERENCE_NUMBER',
    value
  };
}

/*** Change Origin Kind ***/
export type OriginKindSwapAction = {
  type: 'SWAP_ORIGIN_KIND',
  value: string
};

export function originKindSwap(value: string): OriginKindSwapAction {
  return {
    type: 'SWAP_ORIGIN_KIND',
    value
  };
}

/*** Change Destination Kind ***/
export type DestinationKindSwapAction = {
  type: 'SWAP_DESTINATION_KIND',
  value: string
};

export function destinationKindSwap(value: string): DestinationKindSwapAction {
  return {
    type: 'SWAP_DESTINATION_KIND',
    value
  };
}

/*** Change Origin Amount ***/
export type OriginAmountSwapAction = {
  type: 'SWAP_ORIGIN_AMOUNT',
  value: ?number
};

export function originAmountSwap(value: ?number): OriginAmountSwapAction {
  return {
    type: 'SWAP_ORIGIN_AMOUNT',
    value
  };
}

/*** Change Destination Amount ***/
export type DestinationAmountSwapAction = {
  type: 'SWAP_DESTINATION_AMOUNT',
  value: ?number
};

export function destinationAmountSwap(
  value: ?number
): DestinationAmountSwapAction {
  return {
    type: 'SWAP_DESTINATION_AMOUNT',
    value
  };
}

/*** Update Bity Rates ***/
export type Pairs = {
  ETHBTC: number,
  ETHREP: number,
  BTCETH: number,
  BTCREP: number
};

export type BityRatesSwapAction = {
  type: 'SWAP_UPDATE_BITY_RATES',
  value: Pairs
};

export function updateBityRatesSwap(value: Pairs): BityRatesSwapAction {
  return {
    type: 'SWAP_UPDATE_BITY_RATES',
    value
  };
}

/*** Change Destination Address ***/
export type DestinationAddressSwapAction = {
  type: 'SWAP_DESTINATION_ADDRESS',
  value: ?string
};

export function destinationAddressSwap(
  value: ?string
): DestinationAddressSwapAction {
  return {
    type: 'SWAP_DESTINATION_ADDRESS',
    value
  };
}

/*** Restart ***/
export type RestartSwapAction = {
  type: 'SWAP_RESTART'
};

export function restartSwap(): RestartSwapAction {
  return {
    type: 'SWAP_RESTART'
  };
}

/*** Load Bity Rates ***/
export type LoadBityRatesSwapAction = {
  type: 'SWAP_LOAD_BITY_RATES'
};

export function loadBityRatesSwap(): LoadBityRatesSwapAction {
  return {
    type: 'SWAP_LOAD_BITY_RATES'
  };
}

/*** Stop Loading Bity Rates ***/
export type StopLoadBityRatesSwapAction = {
  type: 'SWAP_STOP_LOAD_BITY_RATES'
};

export function stopLoadBityRatesSwap(): StopLoadBityRatesSwapAction {
  return {
    type: 'SWAP_STOP_LOAD_BITY_RATES'
  };
}

/*** Action Type Union ***/
export type SwapAction =
  | ChangeStepSwapAction
  | ReferenceNumberSwapAction
  | OriginKindSwapAction
  | DestinationKindSwapAction
  | OriginAmountSwapAction
  | DestinationAmountSwapAction
  | BityRatesSwapAction
  | DestinationAddressSwapAction
  | RestartSwapAction
  | LoadBityRatesSwapAction
  | StopLoadBityRatesSwapAction;
