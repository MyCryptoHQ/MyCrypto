import {
  TRANSACTION,
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
  type: TRANSACTION.CURRENT_VALUE_SET,
  payload
});

export type TSetCurrentTo = typeof setCurrentTo;
export const setCurrentTo = (payload: SetCurrentToAction['payload']): SetCurrentToAction => ({
  type: TRANSACTION.CURRENT_TO_SET,
  payload
});

//#region Send Everything
export type TSendEverythingRequested = typeof sendEverythingRequested;
export const sendEverythingRequested = (): SendEverythingRequestedAction => ({
  type: TRANSACTION.SEND_EVERYTHING_REQUESTED
});

export type TSendEverythingFailed = typeof sendEverythingFailed;
export const sendEverythingFailed = (): SendEverythingFailedAction => ({
  type: TRANSACTION.SEND_EVERYTHING_FAILED
});

export type TSendEverythingSucceeded = typeof sendEverythingSucceeded;
export const sendEverythingSucceeded = (): SendEverythingSucceededAction => ({
  type: TRANSACTION.SEND_EVERYTHING_SUCCEEDED
});
//#endregion Send Everything

//#region Swap
export type TSwapTokenToEther = typeof swapTokenToEther;
export const swapTokenToEther = (
  payload: SwapTokenToEtherAction['payload']
): SwapTokenToEtherAction => ({
  type: TRANSACTION.TOKEN_TO_ETHER_SWAP,
  payload
});

export type TSwapEtherToToken = typeof swapEtherToToken;
export const swapEtherToToken = (
  payload: SwapEtherToTokenAction['payload']
): SwapEtherToTokenAction => ({
  payload,
  type: TRANSACTION.ETHER_TO_TOKEN_SWAP
});

export const swapTokenToToken = (
  payload: SwapTokenToTokenAction['payload']
): SwapTokenToTokenAction => ({
  payload,
  type: TRANSACTION.TOKEN_TO_TOKEN_SWAP
});
//#endregion Swap
