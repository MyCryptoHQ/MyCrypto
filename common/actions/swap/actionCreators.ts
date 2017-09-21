import * as interfaces from './actionTypes';
import * as constants from './constants';

export type TChangeStepSwap = typeof changeStepSwap;
export function changeStepSwap(value: number): interfaces.ChangeStepSwapAction {
  return {
    type: constants.SWAP_STEP,
    value
  };
}

export type TOriginKindSwap = typeof originKindSwap;

export function originKindSwap(value: string): interfaces.OriginKindSwapAction {
  return {
    type: constants.SWAP_ORIGIN_KIND,
    value
  };
}
export type TDestinationKindSwap = typeof destinationKindSwap;

export function destinationKindSwap(
  value: string
): interfaces.DestinationKindSwapAction {
  return {
    type: constants.SWAP_DESTINATION_KIND,
    value
  };
}
export type TOriginAmountSwap = typeof originAmountSwap;

export function originAmountSwap(
  value?: number | null
): interfaces.OriginAmountSwapAction {
  return {
    type: constants.SWAP_ORIGIN_AMOUNT,
    value
  };
}
export type TDestinationAmountSwap = typeof destinationAmountSwap;

export function destinationAmountSwap(
  value?: number | null
): interfaces.DestinationAmountSwapAction {
  return {
    type: constants.SWAP_DESTINATION_AMOUNT,
    value
  };
}
export type TLoadBityRatesSucceededSwap = typeof loadBityRatesSucceededSwap;

export function loadBityRatesSucceededSwap(
  value: interfaces.Pairs
): interfaces.LoadBityRatesSucceededSwapAction {
  return {
    type: constants.SWAP_LOAD_BITY_RATES_SUCCEEDED,
    value
  };
}
export type TDestinationAddressSwap = typeof destinationAddressSwap;

export function destinationAddressSwap(
  value?: string
): interfaces.DestinationAddressSwapAction {
  return {
    type: constants.SWAP_DESTINATION_ADDRESS,
    value
  };
}
export type TRestartSwap = typeof restartSwap;

export function restartSwap(): interfaces.RestartSwapAction {
  return {
    type: constants.SWAP_RESTART
  };
}
export type TLoadBityRatesRequestedSwap = typeof loadBityRatesRequestedSwap;

export function loadBityRatesRequestedSwap(): interfaces.LoadBityRatesRequestedSwapAction {
  return {
    type: constants.SWAP_LOAD_BITY_RATES_REQUESTED
  };
}
export type TStopLoadBityRatesSwap = typeof stopLoadBityRatesSwap;

export function stopLoadBityRatesSwap(): interfaces.StopLoadBityRatesSwapAction {
  return {
    type: constants.SWAP_STOP_LOAD_BITY_RATES
  };
}
export type TOrderTimeSwap = typeof orderTimeSwap;

export function orderTimeSwap(value: number) {
  return {
    type: constants.SWAP_ORDER_TIME,
    value
  };
}
export type TBityOrderCreateSucceededSwap = typeof bityOrderCreateSucceededSwap;

export function bityOrderCreateSucceededSwap(
  payload: interfaces.BityOrderPostResponse
): interfaces.BityOrderCreateSucceededSwapAction {
  return {
    type: constants.SWAP_BITY_ORDER_CREATE_SUCCEEDED,
    payload
  };
}
export type TBityOrderCreateRequestedSwap = typeof bityOrderCreateRequestedSwap;

export function bityOrderCreateRequestedSwap(
  amount: number,
  destinationAddress: string,
  pair: string,
  mode: number = 0
): interfaces.BityOrderCreateRequestedSwapAction {
  return {
    type: constants.SWAP_ORDER_CREATE_REQUESTED,
    payload: {
      amount,
      destinationAddress,
      pair,
      mode
    }
  };
}
export type TOrderStatusSucceededSwap = typeof orderStatusSucceededSwap;

export function orderStatusSucceededSwap(
  payload: interfaces.BityOrderResponse
): interfaces.OrderStatusSucceededSwapAction {
  return {
    type: constants.SWAP_BITY_ORDER_STATUS_SUCCEEDED,
    payload
  };
}
export type TOrderStatusRequestedSwap = typeof orderStatusRequestedSwap;

export function orderStatusRequestedSwap(): interfaces.OrderStatusRequestedSwapAction {
  return {
    type: constants.SWAP_BITY_ORDER_STATUS_REQUESTED
  };
}
export type TStartOrderTimerSwap = typeof startOrderTimerSwap;

export function startOrderTimerSwap(): interfaces.StartOrderTimerSwapAction {
  return {
    type: constants.SWAP_ORDER_START_TIMER
  };
}
export type TStopOrderTimerSwap = typeof stopOrderTimerSwap;

export function stopOrderTimerSwap(): interfaces.StopOrderTimerSwapAction {
  return {
    type: constants.SWAP_ORDER_STOP_TIMER
  };
}
export type TStartPollBityOrderStatus = typeof startPollBityOrderStatus;

export function startPollBityOrderStatus(): interfaces.StartPollBityOrderStatusAction {
  return {
    type: constants.SWAP_START_POLL_BITY_ORDER_STATUS
  };
}
export type TStopPollBityOrderStatus = typeof stopPollBityOrderStatus;

export function stopPollBityOrderStatus(): interfaces.StopPollBityOrderStatusAction {
  return {
    type: constants.SWAP_STOP_POLL_BITY_ORDER_STATUS
  };
}
