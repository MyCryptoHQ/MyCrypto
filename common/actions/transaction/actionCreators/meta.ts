import {
  TypeKeys,
  SetUnitMetaAction,
  SetTokenValueMetaAction,
  SetTokenToMetaAction,
  SetAsContractInteractionAction,
  SetAsViewAndSendAction
} from 'actions/transaction';

export type TSetTokenTo = typeof setTokenTo;
export const setTokenTo = (payload: SetTokenToMetaAction['payload']): SetTokenToMetaAction => ({
  type: TypeKeys.TOKEN_TO_META_SET,
  payload
});

export type TSetTokenValue = typeof setTokenValue;
export const setTokenValue = (
  payload: SetTokenValueMetaAction['payload']
): SetTokenValueMetaAction => ({
  type: TypeKeys.TOKEN_VALUE_META_SET,
  payload
});

export type TSetUnitMeta = typeof setUnitMeta;
export const setUnitMeta = (payload: SetUnitMetaAction['payload']): SetUnitMetaAction => ({
  type: TypeKeys.UNIT_META_SET,
  payload
});

export type TSetAsContractInteraction = typeof setAsContractInteraction;
export const setAsContractInteraction = (): SetAsContractInteractionAction => ({
  type: TypeKeys.IS_CONTRACT_INTERACTION
});

export type TSetAsViewAndSend = typeof setAsViewAndSend;
export const setAsViewAndSend = (): SetAsViewAndSendAction => ({ type: TypeKeys.IS_VIEW_AND_SEND });
