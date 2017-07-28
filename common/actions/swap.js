// @flow
import * as swapTypes from './swapTypes';

export function changeStepSwap(value: number): swapTypes.ChangeStepSwapAction {
  return {
    type: 'SWAP_STEP',
    value
  };
}

export const originKindSwap = (
  value: string
): swapTypes.OriginKindSwapAction => {
  return {
    type: 'SWAP_ORIGIN_KIND',
    value
  };
};

export const destinationKindSwap = (
  value: string
): swapTypes.DestinationKindSwapAction => {
  return {
    type: 'SWAP_DESTINATION_KIND',
    value
  };
};

export const originAmountSwap = (
  value: ?number
): swapTypes.OriginAmountSwapAction => {
  return {
    type: 'SWAP_ORIGIN_AMOUNT',
    value
  };
};

export const destinationAmountSwap = (
  value: ?number
): swapTypes.DestinationAmountSwapAction => {
  return {
    type: 'SWAP_DESTINATION_AMOUNT',
    value
  };
};

export const updateBityRatesSwap = (
  value: swapTypes.Pairs
): swapTypes.BityRatesSwapAction => {
  return {
    type: 'SWAP_UPDATE_BITY_RATES',
    value
  };
};

export const destinationAddressSwap = (
  value: ?string
): swapTypes.DestinationAddressSwapAction => {
  return {
    type: 'SWAP_DESTINATION_ADDRESS',
    value
  };
};

export const restartSwap = (): swapTypes.RestartSwapAction => {
  return {
    type: 'SWAP_RESTART'
  };
};

export const loadBityRatesSwap = (): swapTypes.LoadBityRatesSwapAction => {
  return {
    type: 'SWAP_LOAD_BITY_RATES'
  };
};

export const stopLoadBityRatesSwap = (): swapTypes.StopLoadBityRatesSwapAction => {
  return {
    type: 'SWAP_STOP_LOAD_BITY_RATES'
  };
};

export function orderCreateSucceededSwap(
  payload: swapTypes.BityOrderPostResponse
): swapTypes.OrderCreateSucceededSwapAction {
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
): swapTypes.OrderCreateRequestedSwapAction {
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
  payload: swapTypes.BityOrderResponse
): swapTypes.OrderStatusSucceededSwapAction {
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
