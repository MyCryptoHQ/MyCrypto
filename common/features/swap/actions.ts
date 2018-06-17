import * as types from './types';

export type TChangeStepSwap = typeof changeStepSwap;
export function changeStepSwap(payload: number): types.ChangeStepSwapAction {
  return {
    type: types.SwapActions.STEP,
    payload
  };
}

export type TInitSwap = typeof initSwap;
export function initSwap(payload: types.SwapInputs): types.InitSwap {
  return {
    type: types.SwapActions.INIT,
    payload
  };
}

export type TLoadBityRatesSucceededSwap = typeof loadBityRatesSucceededSwap;
export function loadBityRatesSucceededSwap(
  payload: types.ApiResponse
): types.LoadBityRatesSucceededSwapAction {
  return {
    type: types.SwapActions.LOAD_BITY_RATES_SUCCEEDED,
    payload
  };
}

export type TLoadShapeshiftRatesSucceededSwap = typeof loadShapeshiftRatesSucceededSwap;
export function loadShapeshiftRatesSucceededSwap(
  payload: types.LoadShapeshiftRatesSucceededSwapAction['payload']
): types.LoadShapeshiftRatesSucceededSwapAction {
  return {
    type: types.SwapActions.LOAD_SHAPESHIFT_RATES_SUCCEEDED,
    payload
  };
}

export type TDestinationAddressSwap = typeof destinationAddressSwap;
export function destinationAddressSwap(payload?: string): types.DestinationAddressSwapAction {
  return {
    type: types.SwapActions.DESTINATION_ADDRESS,
    payload
  };
}

export type TRestartSwap = typeof restartSwap;
export function restartSwap(): types.RestartSwapAction {
  return {
    type: types.SwapActions.RESTART
  };
}

export type TLoadBityRatesRequestedSwap = typeof loadBityRatesRequestedSwap;
export function loadBityRatesRequestedSwap(): types.LoadBityRatesRequestedSwapAction {
  return {
    type: types.SwapActions.LOAD_BITY_RATES_REQUESTED
  };
}

export type TLoadShapeshiftRatesRequestedSwap = typeof loadShapeshiftRatesRequestedSwap;
export function loadShapeshiftRatesRequestedSwap(): types.LoadShapeshiftRatesRequestedSwapAction {
  return {
    type: types.SwapActions.LOAD_SHAPESHIFT_RATES_REQUESTED
  };
}

export type TLoadBityRatesFailedSwap = typeof loadBityRatesFailedSwap;
export function loadBityRatesFailedSwap(): types.LoadBityRatesFailedSwapAction {
  return {
    type: types.SwapActions.LOAD_BITY_RATES_FAILED
  };
}

export type TLoadShapeshiftFailedSwap = typeof loadShapeshiftRatesFailedSwap;
export function loadShapeshiftRatesFailedSwap(): types.LoadShapeshiftRatesFailedSwapAction {
  return {
    type: types.SwapActions.LOAD_SHAPESHIFT_RATES_FAILED
  };
}

export type TStopLoadBityRatesSwap = typeof stopLoadBityRatesSwap;
export function stopLoadBityRatesSwap(): types.StopLoadBityRatesSwapAction {
  return {
    type: types.SwapActions.STOP_LOAD_BITY_RATES
  };
}

export type TStopLoadShapeshiftRatesSwap = typeof stopLoadShapeshiftRatesSwap;
export function stopLoadShapeshiftRatesSwap(): types.StopLoadShapeshiftRatesSwapAction {
  return {
    type: types.SwapActions.STOP_LOAD_SHAPESHIFT_RATES
  };
}

export type TOrderTimeSwap = typeof orderTimeSwap;
export function orderTimeSwap(payload: number): types.OrderSwapTimeSwapAction {
  return {
    type: types.SwapActions.ORDER_TIME,
    payload
  };
}

export type TBityOrderCreateSucceededSwap = typeof bityOrderCreateSucceededSwap;
export function bityOrderCreateSucceededSwap(
  payload: types.BityOrderPostResponse
): types.BityOrderCreateSucceededSwapAction {
  return {
    type: types.SwapActions.BITY_ORDER_CREATE_SUCCEEDED,
    payload
  };
}

export type TShapeshiftOrderCreateSucceededSwap = typeof shapeshiftOrderCreateSucceededSwap;
export function shapeshiftOrderCreateSucceededSwap(
  payload: types.ShapeshiftOrderResponse
): types.ShapeshiftOrderCreateSucceededSwapAction {
  return {
    type: types.SwapActions.SHAPESHIFT_ORDER_CREATE_SUCCEEDED,
    payload
  };
}

export type TBityOrderCreateRequestedSwap = typeof bityOrderCreateRequestedSwap;
export function bityOrderCreateRequestedSwap(
  amount: number,
  destinationAddress: string,
  pair: string,
  mode: number = 0
): types.BityOrderCreateRequestedSwapAction {
  return {
    type: types.SwapActions.BITY_ORDER_CREATE_REQUESTED,
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
): types.ShapeshiftOrderCreateRequestedSwapAction {
  return {
    type: types.SwapActions.SHAPESHIFT_ORDER_CREATE_REQUESTED,
    payload: {
      withdrawal,
      originKind,
      destinationKind,
      destinationAmount
    }
  };
}

export function bityOrderCreateFailedSwap(): types.BityOrderCreateFailedSwapAction {
  return {
    type: types.SwapActions.BITY_ORDER_CREATE_FAILED
  };
}

export function shapeshiftOrderCreateFailedSwap(): types.ShapeshiftOrderCreateFailedSwapAction {
  return {
    type: types.SwapActions.SHAPESHIFT_ORDER_CREATE_FAILED
  };
}

export type TBityOrderStatusSucceededSwap = typeof bityOrderStatusSucceededSwap;
export function bityOrderStatusSucceededSwap(
  payload: types.BityOrderResponse
): types.BityOrderStatusSucceededSwapAction {
  return {
    type: types.SwapActions.BITY_ORDER_STATUS_SUCCEEDED,
    payload
  };
}

export type TShapeshiftOrderStatusSucceededSwap = typeof shapeshiftOrderStatusSucceededSwap;
export function shapeshiftOrderStatusSucceededSwap(
  payload: types.ShapeshiftStatusResponse
): types.ShapeshiftOrderStatusSucceededSwapAction {
  return {
    type: types.SwapActions.SHAPESHIFT_ORDER_STATUS_SUCCEEDED,
    payload
  };
}

export type TBityOrderStatusRequestedSwap = typeof bityOrderStatusRequested;
export function bityOrderStatusRequested(): types.BityOrderStatusRequestedSwapAction {
  return {
    type: types.SwapActions.BITY_ORDER_STATUS_REQUESTED
  };
}

export type TShapeshiftOrderStatusRequestedSwap = typeof shapeshiftOrderStatusRequested;
export function shapeshiftOrderStatusRequested(): types.ShapeshiftOrderStatusRequestedSwapAction {
  return {
    type: types.SwapActions.SHAPESHIFT_ORDER_STATUS_REQUESTED
  };
}

export type TStartOrderTimerSwap = typeof startOrderTimerSwap;
export function startOrderTimerSwap(): types.StartOrderTimerSwapAction {
  return {
    type: types.SwapActions.ORDER_START_TIMER
  };
}

export type TStopOrderTimerSwap = typeof stopOrderTimerSwap;
export function stopOrderTimerSwap(): types.StopOrderTimerSwapAction {
  return {
    type: types.SwapActions.ORDER_STOP_TIMER
  };
}

export type TStartPollBityOrderStatus = typeof startPollBityOrderStatus;
export function startPollBityOrderStatus(): types.StartPollBityOrderStatusAction {
  return {
    type: types.SwapActions.START_POLL_BITY_ORDER_STATUS
  };
}

export type TStartPollShapeshiftOrderStatus = typeof startPollShapeshiftOrderStatus;
export function startPollShapeshiftOrderStatus(): types.StartPollShapeshiftOrderStatusAction {
  return {
    type: types.SwapActions.START_POLL_SHAPESHIFT_ORDER_STATUS
  };
}

export type TStopPollBityOrderStatus = typeof stopPollBityOrderStatus;
export function stopPollBityOrderStatus(): types.StopPollBityOrderStatusAction {
  return {
    type: types.SwapActions.STOP_POLL_BITY_ORDER_STATUS
  };
}

export type TStopPollShapeshiftOrderStatus = typeof stopPollShapeshiftOrderStatus;
export function stopPollShapeshiftOrderStatus(): types.StopPollShapeshiftOrderStatusAction {
  return {
    type: types.SwapActions.STOP_POLL_SHAPESHIFT_ORDER_STATUS
  };
}

export type TConfigureLiteSend = typeof configureLiteSend;
export function configureLiteSend(): types.ConfigureLiteSendAction {
  return { type: types.SwapActions.CONFIGURE_LITE_SEND };
}

export type TShowLiteSend = typeof showLiteSend;
export function showLiteSend(
  payload: types.ShowLiteSendAction['payload']
): types.ShowLiteSendAction {
  return { type: types.SwapActions.SHOW_LITE_SEND, payload };
}

export type TChangeSwapProvider = typeof changeSwapProvider;
export function changeSwapProvider(payload: types.ProviderName): types.ChangeProviderSwapAcion {
  return {
    type: types.SwapActions.CHANGE_PROVIDER,
    payload
  };
}
