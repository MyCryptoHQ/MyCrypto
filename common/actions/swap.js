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

export const originKindSwap = (value: string): OriginKindSwapAction => {
  return {
    type: 'SWAP_ORIGIN_KIND',
    value
  };
};

/*** Change Destination Kind ***/
export type DestinationKindSwapAction = {
  type: 'SWAP_DESTINATION_KIND',
  value: string
};

export const destinationKindSwap = (
  value: string
): DestinationKindSwapAction => {
  return {
    type: 'SWAP_DESTINATION_KIND',
    value
  };
};

/*** Change Origin Amount ***/
export type OriginAmountSwapAction = {
  type: 'SWAP_ORIGIN_AMOUNT',
  value: ?number
};

export const originAmountSwap = (value: ?number): OriginAmountSwapAction => {
  return {
    type: 'SWAP_ORIGIN_AMOUNT',
    value
  };
};

/*** Change Destination Amount ***/
export type DestinationAmountSwapAction = {
  type: 'SWAP_DESTINATION_AMOUNT',
  value: ?number
};

export const destinationAmountSwap = (
  value: ?number
): DestinationAmountSwapAction => {
  return {
    type: 'SWAP_DESTINATION_AMOUNT',
    value
  };
};

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

export const updateBityRatesSwap = (value: Pairs): BityRatesSwapAction => {
  return {
    type: 'SWAP_UPDATE_BITY_RATES',
    value
  };
};

/*** Change Destination Address ***/
export type DestinationAddressSwapAction = {
  type: 'SWAP_DESTINATION_ADDRESS',
  value: ?string
};

export const destinationAddressSwap = (
  value: ?string
): DestinationAddressSwapAction => {
  return {
    type: 'SWAP_DESTINATION_ADDRESS',
    value
  };
};

/*** Restart ***/
export type RestartSwapAction = {
  type: 'SWAP_RESTART'
};

export const restartSwap = (): RestartSwapAction => {
  return {
    type: 'SWAP_RESTART'
  };
};

/*** Load Bity Rates ***/
export type LoadBityRatesSwapAction = {
  type: 'SWAP_LOAD_BITY_RATES'
};

export const loadBityRatesSwap = (): LoadBityRatesSwapAction => {
  return {
    type: 'SWAP_LOAD_BITY_RATES'
  };
};

/*** Stop Loading Bity Rates ***/
export type StopLoadBityRatesSwapAction = {
  type: 'SWAP_STOP_LOAD_BITY_RATES'
};

export const stopLoadBityRatesSwap = (): StopLoadBityRatesSwapAction => {
  return {
    type: 'SWAP_STOP_LOAD_BITY_RATES'
  };
};
