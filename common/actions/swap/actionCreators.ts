import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';

export type TChangeStepSwap = typeof changeStepSwap;
export function changeStepSwap(payload: number): interfaces.ChangeStepSwapAction {
  return {
    type: TypeKeys.SWAP_STEP,
    payload
  };
}

export type TInitSwap = typeof initSwap;
export function initSwap(payload: interfaces.SwapInputs): interfaces.InitSwap {
  return {
    type: TypeKeys.SWAP_INIT,
    payload
  };
}

export type TLoadBityRatesSucceededSwap = typeof loadBityRatesSucceededSwap;
export function loadBityRatesSucceededSwap(
  payload: interfaces.ApiResponse
): interfaces.LoadBityRatesSucceededSwapAction {
  return {
    type: TypeKeys.SWAP_LOAD_BITY_RATES_SUCCEEDED,
    payload
  };
}

export type TLoadShapeshiftSucceededSwap = typeof loadShapeshiftRatesSucceededSwap;
export function loadShapeshiftRatesSucceededSwap(
  payload
): interfaces.LoadShapshiftRatesSucceededSwapAction {
  return {
    type: TypeKeys.SWAP_LOAD_SHAPESHIFT_RATES_SUCCEEDED,
    payload
  };
}

export type TDestinationAddressSwap = typeof destinationAddressSwap;
export function destinationAddressSwap(payload?: string): interfaces.DestinationAddressSwapAction {
  return {
    type: TypeKeys.SWAP_DESTINATION_ADDRESS,
    payload
  };
}

export type TRestartSwap = typeof restartSwap;
export function restartSwap(): interfaces.RestartSwapAction {
  return {
    type: TypeKeys.SWAP_RESTART
  };
}

export type TLoadBityRatesRequestedSwap = typeof loadBityRatesRequestedSwap;
export function loadBityRatesRequestedSwap(): interfaces.LoadBityRatesRequestedSwapAction {
  return {
    type: TypeKeys.SWAP_LOAD_BITY_RATES_REQUESTED
  };
}

export type TLoadShapeshiftRequestedSwap = typeof loadShapeshiftRatesRequestedSwap;
export function loadShapeshiftRatesRequestedSwap(): interfaces.LoadShapeshiftRequestedSwapAction {
  return {
    type: TypeKeys.SWAP_LOAD_SHAPESHIFT_RATES_REQUESTED
  };
}

export type TStopLoadBityRatesSwap = typeof stopLoadBityRatesSwap;
export function stopLoadBityRatesSwap(): interfaces.StopLoadBityRatesSwapAction {
  return {
    type: TypeKeys.SWAP_STOP_LOAD_BITY_RATES
  };
}

export type TStopLoadShapeshiftRatesSwap = typeof stopLoadShapeshiftRatesSwap;
export function stopLoadShapeshiftRatesSwap(): interfaces.StopLoadShapeshiftRatesSwapAction {
  return {
    type: TypeKeys.SWAP_STOP_LOAD_SHAPESHIFT_RATES
  };
}

export type TOrderTimeSwap = typeof orderTimeSwap;
export function orderTimeSwap(payload: number): interfaces.OrderSwapTimeSwapAction {
  return {
    type: TypeKeys.SWAP_ORDER_TIME,
    payload
  };
}

export type TBityOrderCreateSucceededSwap = typeof bityOrderCreateSucceededSwap;
export function bityOrderCreateSucceededSwap(
  payload: interfaces.BityOrderPostResponse
): interfaces.BityOrderCreateSucceededSwapAction {
  return {
    type: TypeKeys.SWAP_BITY_ORDER_CREATE_SUCCEEDED,
    payload
  };
}

export type TShapeshiftOrderCreateSucceededSwap = typeof shapeshiftOrderCreateSucceededSwap;
export function shapeshiftOrderCreateSucceededSwap(
  payload: interfaces.ShapeshiftOrderResponse
): interfaces.ShapeshiftOrderCreateSucceededSwapAction {
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
): interfaces.BityOrderCreateRequestedSwapAction {
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
): interfaces.ShapeshiftOrderCreateRequestedSwapAction {
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

export function bityOrderCreateFailedSwap(): interfaces.BityOrderCreateFailedSwapAction {
  return {
    type: TypeKeys.SWAP_BITY_ORDER_CREATE_FAILED
  };
}

export function shapeshiftOrderCreateFailedSwap(): interfaces.ShapeshiftOrderCreateFailedSwapAction {
  return {
    type: TypeKeys.SWAP_SHAPESHIFT_ORDER_CREATE_FAILED
  };
}

export type TBityOrderStatusSucceededSwap = typeof bityOrderStatusSucceededSwap;
export function bityOrderStatusSucceededSwap(
  payload: interfaces.BityOrderResponse
): interfaces.BityOrderStatusSucceededSwapAction {
  return {
    type: TypeKeys.SWAP_BITY_ORDER_STATUS_SUCCEEDED,
    payload
  };
}

export type TShapeshiftOrderStatusSucceededSwap = typeof shapeshiftOrderStatusSucceededSwap;
export function shapeshiftOrderStatusSucceededSwap(
  payload: interfaces.ShapeshiftStatusResponse
): interfaces.ShapeshiftOrderStatusSucceededSwapAction {
  return {
    type: TypeKeys.SWAP_SHAPESHIFT_ORDER_STATUS_SUCCEEDED,
    payload
  };
}

export type TBityOrderStatusRequestedSwap = typeof bityOrderStatusRequested;
export function bityOrderStatusRequested(): interfaces.BityOrderStatusRequestedSwapAction {
  return {
    type: TypeKeys.SWAP_BITY_ORDER_STATUS_REQUESTED
  };
}

export type TShapeshiftOrderStatusRequestedSwap = typeof shapeshiftOrderStatusRequested;
export function shapeshiftOrderStatusRequested(): interfaces.ShapeshiftOrderStatusRequestedSwapAction {
  return {
    type: TypeKeys.SWAP_SHAPESHIFT_ORDER_STATUS_REQUESTED
  };
}

export type TStartOrderTimerSwap = typeof startOrderTimerSwap;
export function startOrderTimerSwap(): interfaces.StartOrderTimerSwapAction {
  return {
    type: TypeKeys.SWAP_ORDER_START_TIMER
  };
}

export type TStopOrderTimerSwap = typeof stopOrderTimerSwap;
export function stopOrderTimerSwap(): interfaces.StopOrderTimerSwapAction {
  return {
    type: TypeKeys.SWAP_ORDER_STOP_TIMER
  };
}

export type TStartPollBityOrderStatus = typeof startPollBityOrderStatus;
export function startPollBityOrderStatus(): interfaces.StartPollBityOrderStatusAction {
  return {
    type: TypeKeys.SWAP_START_POLL_BITY_ORDER_STATUS
  };
}

export type TStartPollShapeshiftOrderStatus = typeof startPollShapeshiftOrderStatus;
export function startPollShapeshiftOrderStatus(): interfaces.StartPollShapeshiftOrderStatusAction {
  return {
    type: TypeKeys.SWAP_START_POLL_SHAPESHIFT_ORDER_STATUS
  };
}

export type TStopPollBityOrderStatus = typeof stopPollBityOrderStatus;
export function stopPollBityOrderStatus(): interfaces.StopPollBityOrderStatusAction {
  return {
    type: TypeKeys.SWAP_STOP_POLL_BITY_ORDER_STATUS
  };
}

export type TStopPollShapeshiftOrderStatus = typeof stopPollShapeshiftOrderStatus;
export function stopPollShapeshiftOrderStatus(): interfaces.StopPollShapeshiftOrderStatusAction {
  return {
    type: TypeKeys.SWAP_STOP_POLL_SHAPESHIFT_ORDER_STATUS
  };
}

export type TConfigureLiteSend = typeof configureLiteSend;
export function configureLiteSend(): interfaces.ConfigureLiteSendAction {
  return { type: TypeKeys.SWAP_CONFIGURE_LITE_SEND };
}

export type TShowLiteSend = typeof showLiteSend;
export function showLiteSend(
  payload: interfaces.ShowLiteSendAction['payload']
): interfaces.ShowLiteSendAction {
  return { type: TypeKeys.SWAP_SHOW_LITE_SEND, payload };
}

export type TChangeSwapProvider = typeof changeSwapProvider;
export function changeSwapProvider(
  payload: interfaces.ProviderName
): interfaces.ChangeProviderSwapAcion {
  return {
    type: TypeKeys.SWAP_CHANGE_PROVIDER,
    payload
  };
}
