import * as swapTypes from './types';

export type TChangeStepSwap = typeof changeStepSwap;
export function changeStepSwap(payload: number): swapTypes.ChangeStepSwapAction {
  return {
    type: swapTypes.SwapActions.STEP,
    payload
  };
}

export type TInitSwap = typeof initSwap;
export function initSwap(payload: swapTypes.SwapInputs): swapTypes.InitSwap {
  return {
    type: swapTypes.SwapActions.INIT,
    payload
  };
}

export type TLoadBityRatesSucceededSwap = typeof loadBityRatesSucceededSwap;
export function loadBityRatesSucceededSwap(
  payload: swapTypes.ApiResponse
): swapTypes.LoadBityRatesSucceededSwapAction {
  return {
    type: swapTypes.SwapActions.LOAD_BITY_RATES_SUCCEEDED,
    payload
  };
}

export type TLoadShapeshiftRatesSucceededSwap = typeof loadShapeshiftRatesSucceededSwap;
export function loadShapeshiftRatesSucceededSwap(
  payload: swapTypes.LoadShapeshiftRatesSucceededSwapAction['payload']
): swapTypes.LoadShapeshiftRatesSucceededSwapAction {
  return {
    type: swapTypes.SwapActions.LOAD_SHAPESHIFT_RATES_SUCCEEDED,
    payload
  };
}

export type TDestinationAddressSwap = typeof destinationAddressSwap;
export function destinationAddressSwap(payload?: string): swapTypes.DestinationAddressSwapAction {
  return {
    type: swapTypes.SwapActions.DESTINATION_ADDRESS,
    payload
  };
}

export type TRestartSwap = typeof restartSwap;
export function restartSwap(): swapTypes.RestartSwapAction {
  return {
    type: swapTypes.SwapActions.RESTART
  };
}

export type TLoadBityRatesRequestedSwap = typeof loadBityRatesRequestedSwap;
export function loadBityRatesRequestedSwap(): swapTypes.LoadBityRatesRequestedSwapAction {
  return {
    type: swapTypes.SwapActions.LOAD_BITY_RATES_REQUESTED
  };
}

export type TLoadShapeshiftRatesRequestedSwap = typeof loadShapeshiftRatesRequestedSwap;
export function loadShapeshiftRatesRequestedSwap(): swapTypes.LoadShapeshiftRatesRequestedSwapAction {
  return {
    type: swapTypes.SwapActions.LOAD_SHAPESHIFT_RATES_REQUESTED
  };
}

export type TLoadBityRatesFailedSwap = typeof loadBityRatesFailedSwap;
export function loadBityRatesFailedSwap(): swapTypes.LoadBityRatesFailedSwapAction {
  return {
    type: swapTypes.SwapActions.LOAD_BITY_RATES_FAILED
  };
}

export type TLoadShapeshiftFailedSwap = typeof loadShapeshiftRatesFailedSwap;
export function loadShapeshiftRatesFailedSwap(): swapTypes.LoadShapeshiftRatesFailedSwapAction {
  return {
    type: swapTypes.SwapActions.LOAD_SHAPESHIFT_RATES_FAILED
  };
}

export type TStopLoadBityRatesSwap = typeof stopLoadBityRatesSwap;
export function stopLoadBityRatesSwap(): swapTypes.StopLoadBityRatesSwapAction {
  return {
    type: swapTypes.SwapActions.STOP_LOAD_BITY_RATES
  };
}

export type TStopLoadShapeshiftRatesSwap = typeof stopLoadShapeshiftRatesSwap;
export function stopLoadShapeshiftRatesSwap(): swapTypes.StopLoadShapeshiftRatesSwapAction {
  return {
    type: swapTypes.SwapActions.STOP_LOAD_SHAPESHIFT_RATES
  };
}

export type TOrderTimeSwap = typeof orderTimeSwap;
export function orderTimeSwap(payload: number): swapTypes.OrderSwapTimeSwapAction {
  return {
    type: swapTypes.SwapActions.ORDER_TIME,
    payload
  };
}

export type TBityOrderCreateSucceededSwap = typeof bityOrderCreateSucceededSwap;
export function bityOrderCreateSucceededSwap(
  payload: swapTypes.BityOrderPostResponse
): swapTypes.BityOrderCreateSucceededSwapAction {
  return {
    type: swapTypes.SwapActions.BITY_ORDER_CREATE_SUCCEEDED,
    payload
  };
}

export type TShapeshiftOrderCreateSucceededSwap = typeof shapeshiftOrderCreateSucceededSwap;
export function shapeshiftOrderCreateSucceededSwap(
  payload: swapTypes.ShapeshiftOrderResponse
): swapTypes.ShapeshiftOrderCreateSucceededSwapAction {
  return {
    type: swapTypes.SwapActions.SHAPESHIFT_ORDER_CREATE_SUCCEEDED,
    payload
  };
}

export type TBityOrderCreateRequestedSwap = typeof bityOrderCreateRequestedSwap;
export function bityOrderCreateRequestedSwap(
  amount: number,
  destinationAddress: string,
  pair: string,
  mode: number = 0
): swapTypes.BityOrderCreateRequestedSwapAction {
  return {
    type: swapTypes.SwapActions.BITY_ORDER_CREATE_REQUESTED,
    payload: {
      amount,
      destinationAddress,
      pair,
      mode
    }
  };
}

export type TShapeshiftOrderCreateRequestedSwap = typeof shapeshiftOrderCreateRequestedSwap;
export function shapeshiftOrderCreateRequestedSwap(
  withdrawal: string,
  originKind: string,
  destinationKind: string,
  destinationAmount: number
): swapTypes.ShapeshiftOrderCreateRequestedSwapAction {
  return {
    type: swapTypes.SwapActions.SHAPESHIFT_ORDER_CREATE_REQUESTED,
    payload: {
      withdrawal,
      originKind,
      destinationKind,
      destinationAmount
    }
  };
}

export function bityOrderCreateFailedSwap(): swapTypes.BityOrderCreateFailedSwapAction {
  return {
    type: swapTypes.SwapActions.BITY_ORDER_CREATE_FAILED
  };
}

export function shapeshiftOrderCreateFailedSwap(): swapTypes.ShapeshiftOrderCreateFailedSwapAction {
  return {
    type: swapTypes.SwapActions.SHAPESHIFT_ORDER_CREATE_FAILED
  };
}

export type TBityOrderStatusSucceededSwap = typeof bityOrderStatusSucceededSwap;
export function bityOrderStatusSucceededSwap(
  payload: swapTypes.BityOrderResponse
): swapTypes.BityOrderStatusSucceededSwapAction {
  return {
    type: swapTypes.SwapActions.BITY_ORDER_STATUS_SUCCEEDED,
    payload
  };
}

export type TShapeshiftOrderStatusSucceededSwap = typeof shapeshiftOrderStatusSucceededSwap;
export function shapeshiftOrderStatusSucceededSwap(
  payload: swapTypes.ShapeshiftStatusResponse
): swapTypes.ShapeshiftOrderStatusSucceededSwapAction {
  return {
    type: swapTypes.SwapActions.SHAPESHIFT_ORDER_STATUS_SUCCEEDED,
    payload
  };
}

export type TBityOrderStatusRequestedSwap = typeof bityOrderStatusRequested;
export function bityOrderStatusRequested(): swapTypes.BityOrderStatusRequestedSwapAction {
  return {
    type: swapTypes.SwapActions.BITY_ORDER_STATUS_REQUESTED
  };
}

export type TShapeshiftOrderStatusRequestedSwap = typeof shapeshiftOrderStatusRequested;
export function shapeshiftOrderStatusRequested(): swapTypes.ShapeshiftOrderStatusRequestedSwapAction {
  return {
    type: swapTypes.SwapActions.SHAPESHIFT_ORDER_STATUS_REQUESTED
  };
}

export type TStartOrderTimerSwap = typeof startOrderTimerSwap;
export function startOrderTimerSwap(): swapTypes.StartOrderTimerSwapAction {
  return {
    type: swapTypes.SwapActions.ORDER_START_TIMER
  };
}

export type TStopOrderTimerSwap = typeof stopOrderTimerSwap;
export function stopOrderTimerSwap(): swapTypes.StopOrderTimerSwapAction {
  return {
    type: swapTypes.SwapActions.ORDER_STOP_TIMER
  };
}

export type TStartPollBityOrderStatus = typeof startPollBityOrderStatus;
export function startPollBityOrderStatus(): swapTypes.StartPollBityOrderStatusAction {
  return {
    type: swapTypes.SwapActions.START_POLL_BITY_ORDER_STATUS
  };
}

export type TStartPollShapeshiftOrderStatus = typeof startPollShapeshiftOrderStatus;
export function startPollShapeshiftOrderStatus(): swapTypes.StartPollShapeshiftOrderStatusAction {
  return {
    type: swapTypes.SwapActions.START_POLL_SHAPESHIFT_ORDER_STATUS
  };
}

export type TStopPollBityOrderStatus = typeof stopPollBityOrderStatus;
export function stopPollBityOrderStatus(): swapTypes.StopPollBityOrderStatusAction {
  return {
    type: swapTypes.SwapActions.STOP_POLL_BITY_ORDER_STATUS
  };
}

export type TStopPollShapeshiftOrderStatus = typeof stopPollShapeshiftOrderStatus;
export function stopPollShapeshiftOrderStatus(): swapTypes.StopPollShapeshiftOrderStatusAction {
  return {
    type: swapTypes.SwapActions.STOP_POLL_SHAPESHIFT_ORDER_STATUS
  };
}

export type TConfigureLiteSend = typeof configureLiteSend;
export function configureLiteSend(): swapTypes.ConfigureLiteSendAction {
  return { type: swapTypes.SwapActions.CONFIGURE_LITE_SEND };
}

export type TShowLiteSend = typeof showLiteSend;
export function showLiteSend(
  payload: swapTypes.ShowLiteSendAction['payload']
): swapTypes.ShowLiteSendAction {
  return { type: swapTypes.SwapActions.SHOW_LITE_SEND, payload };
}

export type TChangeSwapProvider = typeof changeSwapProvider;
export function changeSwapProvider(
  payload: swapTypes.ProviderName
): swapTypes.ChangeProviderSwapAcion {
  return {
    type: swapTypes.SwapActions.CHANGE_PROVIDER,
    payload
  };
}
