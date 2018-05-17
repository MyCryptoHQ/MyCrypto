import {
  TypeKeys,
  ApiResponse,
  SwapInputs,
  BityOrderResponse,
  BityOrderPostResponse,
  BityOrderStatusRequestedSwapAction,
  ShapeshiftOrderResponse,
  ShapeshiftStatusResponse,
  ShapeshiftOrderStatusRequestedSwapAction,
  StartOrderTimerSwapAction,
  StopOrderTimerSwapAction,
  StopPollBityOrderStatusAction,
  StopPollShapeshiftOrderStatusAction,
  ProviderName,
  ChangeStepSwapAction,
  InitSwap,
  DestinationAddressSwapAction,
  RestartSwapAction,
  LoadBityRatesRequestedSwapAction,
  LoadBityRatesSucceededSwapAction,
  LoadBityRatesFailedSwapAction,
  LoadShapeshiftRatesRequestedSwapAction,
  LoadShapeshiftRatesSucceededSwapAction,
  LoadShapeshiftRatesFailedSwapAction,
  StopLoadBityRatesSwapAction,
  StopLoadShapeshiftRatesSwapAction,
  BityOrderCreateRequestedSwapAction,
  ShapeshiftOrderCreateRequestedSwapAction,
  BityOrderCreateSucceededSwapAction,
  ShapeshiftOrderCreateSucceededSwapAction,
  BityOrderStatusSucceededSwapAction,
  ShapeshiftOrderStatusSucceededSwapAction,
  StartPollBityOrderStatusAction,
  StartPollShapeshiftOrderStatusAction,
  BityOrderCreateFailedSwapAction,
  ShapeshiftOrderCreateFailedSwapAction,
  OrderSwapTimeSwapAction,
  ChangeProviderSwapAcion,
  ConfigureLiteSendAction,
  ShowLiteSendAction
} from './types';

export type TChangeStepSwap = typeof changeStepSwap;
export function changeStepSwap(payload: number): ChangeStepSwapAction {
  return {
    type: TypeKeys.SWAP_STEP,
    payload
  };
}

export type TInitSwap = typeof initSwap;
export function initSwap(payload: SwapInputs): InitSwap {
  return {
    type: TypeKeys.SWAP_INIT,
    payload
  };
}

export type TLoadBityRatesSucceededSwap = typeof loadBityRatesSucceededSwap;
export function loadBityRatesSucceededSwap(payload: ApiResponse): LoadBityRatesSucceededSwapAction {
  return {
    type: TypeKeys.SWAP_LOAD_BITY_RATES_SUCCEEDED,
    payload
  };
}

export type TLoadShapeshiftRatesSucceededSwap = typeof loadShapeshiftRatesSucceededSwap;
export function loadShapeshiftRatesSucceededSwap(
  payload: LoadShapeshiftRatesSucceededSwapAction['payload']
): LoadShapeshiftRatesSucceededSwapAction {
  return {
    type: TypeKeys.SWAP_LOAD_SHAPESHIFT_RATES_SUCCEEDED,
    payload
  };
}

export type TDestinationAddressSwap = typeof destinationAddressSwap;
export function destinationAddressSwap(payload?: string): DestinationAddressSwapAction {
  return {
    type: TypeKeys.SWAP_DESTINATION_ADDRESS,
    payload
  };
}

export type TRestartSwap = typeof restartSwap;
export function restartSwap(): RestartSwapAction {
  return {
    type: TypeKeys.SWAP_RESTART
  };
}

export type TLoadBityRatesRequestedSwap = typeof loadBityRatesRequestedSwap;
export function loadBityRatesRequestedSwap(): LoadBityRatesRequestedSwapAction {
  return {
    type: TypeKeys.SWAP_LOAD_BITY_RATES_REQUESTED
  };
}

export type TLoadShapeshiftRatesRequestedSwap = typeof loadShapeshiftRatesRequestedSwap;
export function loadShapeshiftRatesRequestedSwap(): LoadShapeshiftRatesRequestedSwapAction {
  return {
    type: TypeKeys.SWAP_LOAD_SHAPESHIFT_RATES_REQUESTED
  };
}

export type TLoadBityRatesFailedSwap = typeof loadBityRatesFailedSwap;
export function loadBityRatesFailedSwap(): LoadBityRatesFailedSwapAction {
  return {
    type: TypeKeys.SWAP_LOAD_BITY_RATES_FAILED
  };
}

export type TLoadShapeshiftFailedSwap = typeof loadShapeshiftRatesFailedSwap;
export function loadShapeshiftRatesFailedSwap(): LoadShapeshiftRatesFailedSwapAction {
  return {
    type: TypeKeys.SWAP_LOAD_SHAPESHIFT_RATES_FAILED
  };
}

export type TStopLoadBityRatesSwap = typeof stopLoadBityRatesSwap;
export function stopLoadBityRatesSwap(): StopLoadBityRatesSwapAction {
  return {
    type: TypeKeys.SWAP_STOP_LOAD_BITY_RATES
  };
}

export type TStopLoadShapeshiftRatesSwap = typeof stopLoadShapeshiftRatesSwap;
export function stopLoadShapeshiftRatesSwap(): StopLoadShapeshiftRatesSwapAction {
  return {
    type: TypeKeys.SWAP_STOP_LOAD_SHAPESHIFT_RATES
  };
}

export type TOrderTimeSwap = typeof orderTimeSwap;
export function orderTimeSwap(payload: number): OrderSwapTimeSwapAction {
  return {
    type: TypeKeys.SWAP_ORDER_TIME,
    payload
  };
}

export type TBityOrderCreateSucceededSwap = typeof bityOrderCreateSucceededSwap;
export function bityOrderCreateSucceededSwap(
  payload: BityOrderPostResponse
): BityOrderCreateSucceededSwapAction {
  return {
    type: TypeKeys.SWAP_BITY_ORDER_CREATE_SUCCEEDED,
    payload
  };
}

export type TShapeshiftOrderCreateSucceededSwap = typeof shapeshiftOrderCreateSucceededSwap;
export function shapeshiftOrderCreateSucceededSwap(
  payload: ShapeshiftOrderResponse
): ShapeshiftOrderCreateSucceededSwapAction {
  return {
    type: TypeKeys.SWAP_SHAPESHIFT_ORDER_CREATE_SUCCEEDED,
    payload
  };
}

export type TBityOrderCreateRequestedSwap = typeof bityOrderCreateRequestedSwap;
export function bityOrderCreateRequestedSwap(
  amount: number,
  destinationAddress: string,
  pair: string,
  mode: number = 0
): BityOrderCreateRequestedSwapAction {
  return {
    type: TypeKeys.SWAP_BITY_ORDER_CREATE_REQUESTED,
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
): ShapeshiftOrderCreateRequestedSwapAction {
  return {
    type: TypeKeys.SWAP_SHAPESHIFT_ORDER_CREATE_REQUESTED,
    payload: {
      withdrawal,
      originKind,
      destinationKind,
      destinationAmount
    }
  };
}

export function bityOrderCreateFailedSwap(): BityOrderCreateFailedSwapAction {
  return {
    type: TypeKeys.SWAP_BITY_ORDER_CREATE_FAILED
  };
}

export function shapeshiftOrderCreateFailedSwap(): ShapeshiftOrderCreateFailedSwapAction {
  return {
    type: TypeKeys.SWAP_SHAPESHIFT_ORDER_CREATE_FAILED
  };
}

export type TBityOrderStatusSucceededSwap = typeof bityOrderStatusSucceededSwap;
export function bityOrderStatusSucceededSwap(
  payload: BityOrderResponse
): BityOrderStatusSucceededSwapAction {
  return {
    type: TypeKeys.SWAP_BITY_ORDER_STATUS_SUCCEEDED,
    payload
  };
}

export type TShapeshiftOrderStatusSucceededSwap = typeof shapeshiftOrderStatusSucceededSwap;
export function shapeshiftOrderStatusSucceededSwap(
  payload: ShapeshiftStatusResponse
): ShapeshiftOrderStatusSucceededSwapAction {
  return {
    type: TypeKeys.SWAP_SHAPESHIFT_ORDER_STATUS_SUCCEEDED,
    payload
  };
}

export type TBityOrderStatusRequestedSwap = typeof bityOrderStatusRequested;
export function bityOrderStatusRequested(): BityOrderStatusRequestedSwapAction {
  return {
    type: TypeKeys.SWAP_BITY_ORDER_STATUS_REQUESTED
  };
}

export type TShapeshiftOrderStatusRequestedSwap = typeof shapeshiftOrderStatusRequested;
export function shapeshiftOrderStatusRequested(): ShapeshiftOrderStatusRequestedSwapAction {
  return {
    type: TypeKeys.SWAP_SHAPESHIFT_ORDER_STATUS_REQUESTED
  };
}

export type TStartOrderTimerSwap = typeof startOrderTimerSwap;
export function startOrderTimerSwap(): StartOrderTimerSwapAction {
  return {
    type: TypeKeys.SWAP_ORDER_START_TIMER
  };
}

export type TStopOrderTimerSwap = typeof stopOrderTimerSwap;
export function stopOrderTimerSwap(): StopOrderTimerSwapAction {
  return {
    type: TypeKeys.SWAP_ORDER_STOP_TIMER
  };
}

export type TStartPollBityOrderStatus = typeof startPollBityOrderStatus;
export function startPollBityOrderStatus(): StartPollBityOrderStatusAction {
  return {
    type: TypeKeys.SWAP_START_POLL_BITY_ORDER_STATUS
  };
}

export type TStartPollShapeshiftOrderStatus = typeof startPollShapeshiftOrderStatus;
export function startPollShapeshiftOrderStatus(): StartPollShapeshiftOrderStatusAction {
  return {
    type: TypeKeys.SWAP_START_POLL_SHAPESHIFT_ORDER_STATUS
  };
}

export type TStopPollBityOrderStatus = typeof stopPollBityOrderStatus;
export function stopPollBityOrderStatus(): StopPollBityOrderStatusAction {
  return {
    type: TypeKeys.SWAP_STOP_POLL_BITY_ORDER_STATUS
  };
}

export type TStopPollShapeshiftOrderStatus = typeof stopPollShapeshiftOrderStatus;
export function stopPollShapeshiftOrderStatus(): StopPollShapeshiftOrderStatusAction {
  return {
    type: TypeKeys.SWAP_STOP_POLL_SHAPESHIFT_ORDER_STATUS
  };
}

export type TConfigureLiteSend = typeof configureLiteSend;
export function configureLiteSend(): ConfigureLiteSendAction {
  return { type: TypeKeys.SWAP_CONFIGURE_LITE_SEND };
}

export type TShowLiteSend = typeof showLiteSend;
export function showLiteSend(payload: ShowLiteSendAction['payload']): ShowLiteSendAction {
  return { type: TypeKeys.SWAP_SHOW_LITE_SEND, payload };
}

export type TChangeSwapProvider = typeof changeSwapProvider;
export function changeSwapProvider(payload: ProviderName): ChangeProviderSwapAcion {
  return {
    type: TypeKeys.SWAP_CHANGE_PROVIDER,
    payload
  };
}
