import {
  SWAP_DESTINATION_AMOUNT,
  SWAP_DESTINATION_KIND,
  SWAP_ORIGIN_AMOUNT,
  SWAP_ORIGIN_KIND,
  SWAP_UPDATE_BITY_RATES,
  SWAP_DESTINATION_ADDRESS,
  SWAP_RESTART,
  SWAP_LOAD_BITY_RATES,
  SWAP_STOP_LOAD_BITY_RATES,
  SWAP_STEP,
  SWAP_REFERENCE_NUMBER
} from './swapConstants';

export type Pairs = {
  ETHBTC: number,
  ETHREP: number,
  BTCETH: number,
  BTCREP: number
};

export type ReferenceNumberSwapAction = {
  type: SWAP_REFERENCE_NUMBER,
  value: string
};
export type OriginKindSwapAction = {
  type: SWAP_ORIGIN_KIND,
  value: string
};
export type DestinationKindSwapAction = {
  type: SWAP_DESTINATION_KIND,
  value: string
};
export type OriginAmountSwapAction = {
  type: SWAP_ORIGIN_AMOUNT,
  value: ?number
};
export type DestinationAmountSwapAction = {
  type: SWAP_DESTINATION_AMOUNT,
  value: ?number
};
export type BityRatesSwapAction = {
  type: SWAP_UPDATE_BITY_RATES,
  value: Pairs
};
export type DestinationAddressSwapAction = {
  type: SWAP_DESTINATION_ADDRESS,
  value: ?number
};

export type RestartSwapAction = {
  type: SWAP_RESTART
};

export type LoadBityRatesSwapAction = {
  type: SWAP_LOAD_BITY_RATES
};

export type ChangeStepSwapAction = {
  type: SWAP_STEP,
  value: number
};

export type StopLoadBityRatesSwapAction = {
  type: SWAP_STOP_LOAD_BITY_RATES
};
