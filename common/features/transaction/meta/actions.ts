import * as types from './types';

export type TSetTokenTo = typeof setTokenTo;
export const setTokenTo = (
  payload: types.SetTokenToMetaAction['payload']
): types.SetTokenToMetaAction => ({
  type: types.TransactionMetaActions.TOKEN_TO_META_SET,
  payload
});

export type TSetTokenValue = typeof setTokenValue;
export const setTokenValue = (
  payload: types.SetTokenValueMetaAction['payload']
): types.SetTokenValueMetaAction => ({
  type: types.TransactionMetaActions.TOKEN_VALUE_META_SET,
  payload
});

export type TSetUnitMeta = typeof setUnitMeta;
export const setUnitMeta = (
  payload: types.SetUnitMetaAction['payload']
): types.SetUnitMetaAction => ({
  type: types.TransactionMetaActions.UNIT_META_SET,
  payload
});

export type TSetAsContractInteraction = typeof setAsContractInteraction;
export const setAsContractInteraction = (): types.SetAsContractInteractionAction => ({
  type: types.TransactionMetaActions.IS_CONTRACT_INTERACTION
});

export type TSetAsViewAndSend = typeof setAsViewAndSend;
export const setAsViewAndSend = (): types.SetAsViewAndSendAction => ({
  type: types.TransactionMetaActions.IS_VIEW_AND_SEND
});
