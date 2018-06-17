import * as types from './types';

export type TSetCurrentValue = typeof setCurrentValue;
export const setCurrentValue = (
  payload: types.SetCurrentValueAction['payload']
): types.SetCurrentValueAction => ({
  type: types.TransactionActions.CURRENT_VALUE_SET,
  payload
});

export type TSetCurrentTo = typeof setCurrentTo;
export const setCurrentTo = (
  payload: types.SetCurrentToAction['payload']
): types.SetCurrentToAction => ({
  type: types.TransactionActions.CURRENT_TO_SET,
  payload
});

//#region Send Everything
export type TSendEverythingRequested = typeof sendEverythingRequested;
export const sendEverythingRequested = (): types.SendEverythingRequestedAction => ({
  type: types.TransactionActions.SEND_EVERYTHING_REQUESTED
});

export type TSendEverythingFailed = typeof sendEverythingFailed;
export const sendEverythingFailed = (): types.SendEverythingFailedAction => ({
  type: types.TransactionActions.SEND_EVERYTHING_FAILED
});

export type TSendEverythingSucceeded = typeof sendEverythingSucceeded;
export const sendEverythingSucceeded = (): types.SendEverythingSucceededAction => ({
  type: types.TransactionActions.SEND_EVERYTHING_SUCCEEDED
});
//#endregion Send Everything

//#region Swap
export type TSwapTokenToEther = typeof swapTokenToEther;
export const swapTokenToEther = (
  payload: types.SwapTokenToEtherAction['payload']
): types.SwapTokenToEtherAction => ({
  type: types.TransactionActions.TOKEN_TO_ETHER_SWAP,
  payload
});

export type TSwapEtherToToken = typeof swapEtherToToken;
export const swapEtherToToken = (
  payload: types.SwapEtherToTokenAction['payload']
): types.SwapEtherToTokenAction => ({
  payload,
  type: types.TransactionActions.ETHER_TO_TOKEN_SWAP
});

export const swapTokenToToken = (
  payload: types.SwapTokenToTokenAction['payload']
): types.SwapTokenToTokenAction => ({
  payload,
  type: types.TransactionActions.TOKEN_TO_TOKEN_SWAP
});
//#endregion Swap
