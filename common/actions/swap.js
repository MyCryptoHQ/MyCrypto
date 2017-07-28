// @flow
import type {
  OriginKindSwapAction,
  DestinationKindSwapAction,
  OriginAmountSwapAction,
  DestinationAmountSwapAction,
  BityRatesSwapAction,
  DestinationAddressSwapAction,
  OrderCreateSucceededSwapAction,
  OrderCreateRequestedSwapAction,
  OrderStatusSucceededSwapAction,
  ChangeStepSwapAction,
  Pairs,
  RestartSwapAction,
  LoadBityRatesSwapAction,
  StopLoadBityRatesSwapAction,
  BityOrderResponse,
  BityOrderPostResponse
} from './swapTypes';

export function changeStepSwap(value: number): ChangeStepSwapAction {
  return {
    type: 'SWAP_STEP',
    value
  };
}

export function originKindSwap(value: string): OriginKindSwapAction {
  return {
    type: 'SWAP_ORIGIN_KIND',
    value
  };
}

export function destinationKindSwap(value: string): DestinationKindSwapAction {
  return {
    type: 'SWAP_DESTINATION_KIND',
    value
  };
}

export function originAmountSwap(value: ?number): OriginAmountSwapAction {
  return {
    type: 'SWAP_ORIGIN_AMOUNT',
    value
  };
}

export function destinationAmountSwap(
  value: ?number
): DestinationAmountSwapAction {
  return {
    type: 'SWAP_DESTINATION_AMOUNT',
    value
  };
}

export function updateBityRatesSwap(value: Pairs): BityRatesSwapAction {
  return {
    type: 'SWAP_UPDATE_BITY_RATES',
    value
  };
}

export function destinationAddressSwap(
  value: ?string
): DestinationAddressSwapAction {
  return {
    type: 'SWAP_DESTINATION_ADDRESS',
    value
  };
}

export function restartSwap(): RestartSwapAction {
  return {
    type: 'SWAP_RESTART'
  };
}

export function loadBityRatesSwap(): LoadBityRatesSwapAction {
  return {
    type: 'SWAP_LOAD_BITY_RATES'
  };
}

export function stopLoadBityRatesSwap(): StopLoadBityRatesSwapAction {
  return {
    type: 'SWAP_STOP_LOAD_BITY_RATES'
  };
}

export function orderCreateSucceededSwap(
  payload: BityOrderPostResponse
): OrderCreateSucceededSwapAction {
  return {
    type: 'SWAP_ORDER_CREATE_SUCCEEDED',
    payload
  };
}

export function orderCreateRequestedSwap(
  amount: number,
  destinationAddress: string,
  pair: string,
  mode: number = 0
): OrderCreateRequestedSwapAction {
  return {
    type: 'SWAP_ORDER_CREATE_REQUESTED',
    payload: {
      amount,
      destinationAddress,
      pair,
      mode
    }
  };
}

export function orderTimeTickSwap() {
  return {
    type: 'SWAP_ORDER_TIME_TICK'
  };
}

export function orderStatusSucceededSwap(
  payload: BityOrderResponse
): OrderStatusSucceededSwapAction {
  return {
    type: 'SWAP_BITY_ORDER_STATUS_SUCCEEDED',
    payload
  };
}

export function orderStatusRequestedSwap() {
  return {
    type: 'SWAP_BITY_ORDER_STATUS_REQUESTED'
  };
}
