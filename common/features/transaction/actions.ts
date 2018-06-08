import {
  TypeKeys,
  SetCurrentToAction,
  SetCurrentValueAction,
  SendEverythingFailedAction,
  SendEverythingRequestedAction,
  SendEverythingSucceededAction,
  SwapEtherToTokenAction,
  SwapTokenToEtherAction,
  SwapTokenToTokenAction
} from './types';

export type TSetCurrentValue = typeof setCurrentValue;
export const setCurrentValue = (
  payload: SetCurrentValueAction['payload']
): SetCurrentValueAction => ({
  type: TypeKeys.CURRENT_VALUE_SET,
  payload
});

export type TSetCurrentTo = typeof setCurrentTo;
export const setCurrentTo = (payload: SetCurrentToAction['payload']): SetCurrentToAction => ({
  type: TypeKeys.CURRENT_TO_SET,
  payload
});

//#region Send Everything
export type TSendEverythingRequested = typeof sendEverythingRequested;
export const sendEverythingRequested = (): SendEverythingRequestedAction => ({
  type: TypeKeys.SEND_EVERYTHING_REQUESTED
});

export type TSendEverythingFailed = typeof sendEverythingFailed;
export const sendEverythingFailed = (): SendEverythingFailedAction => ({
  type: TypeKeys.SEND_EVERYTHING_FAILED
});

export type TSendEverythingSucceeded = typeof sendEverythingSucceeded;
export const sendEverythingSucceeded = (): SendEverythingSucceededAction => ({
  type: TypeKeys.SEND_EVERYTHING_SUCCEEDED
});
//#endregion Send Everything

//#region Swap
export type TSwapTokenToEther = typeof swapTokenToEther;
export const swapTokenToEther = (
  payload: SwapTokenToEtherAction['payload']
): SwapTokenToEtherAction => ({
  type: TypeKeys.TOKEN_TO_ETHER_SWAP,
  payload
});

export type TSwapEtherToToken = typeof swapEtherToToken;
export const swapEtherToToken = (
  payload: SwapEtherToTokenAction['payload']
): SwapEtherToTokenAction => ({
  payload,
  type: TypeKeys.ETHER_TO_TOKEN_SWAP
});

export const swapTokenToToken = (
  payload: SwapTokenToTokenAction['payload']
): SwapTokenToTokenAction => ({
  payload,
  type: TypeKeys.TOKEN_TO_TOKEN_SWAP
});
//#endregion Swap
