import {
  TRANSACTION_META,
  SetUnitMetaAction,
  SetTokenValueMetaAction,
  SetTokenToMetaAction,
  SetAsContractInteractionAction,
  SetAsViewAndSendAction
} from './types';

export type TSetTokenTo = typeof setTokenTo;
export const setTokenTo = (payload: SetTokenToMetaAction['payload']): SetTokenToMetaAction => ({
  type: TRANSACTION_META.TOKEN_TO_META_SET,
  payload
});

export type TSetTokenValue = typeof setTokenValue;
export const setTokenValue = (
  payload: SetTokenValueMetaAction['payload']
): SetTokenValueMetaAction => ({
  type: TRANSACTION_META.TOKEN_VALUE_META_SET,
  payload
});

export type TSetUnitMeta = typeof setUnitMeta;
export const setUnitMeta = (payload: SetUnitMetaAction['payload']): SetUnitMetaAction => ({
  type: TRANSACTION_META.UNIT_META_SET,
  payload
});

export type TSetAsContractInteraction = typeof setAsContractInteraction;
export const setAsContractInteraction = (): SetAsContractInteractionAction => ({
  type: TRANSACTION_META.IS_CONTRACT_INTERACTION
});

export type TSetAsViewAndSend = typeof setAsViewAndSend;
export const setAsViewAndSend = (): SetAsViewAndSendAction => ({
  type: TRANSACTION_META.IS_VIEW_AND_SEND
});
