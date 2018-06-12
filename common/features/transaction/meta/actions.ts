import { TRANSACTION } from '../types';
import {
  SetUnitMetaAction,
  SetTokenValueMetaAction,
  SetTokenToMetaAction,
  SetAsContractInteractionAction,
  SetAsViewAndSendAction
} from './types';

export type TSetTokenTo = typeof setTokenTo;
export const setTokenTo = (payload: SetTokenToMetaAction['payload']): SetTokenToMetaAction => ({
  type: TRANSACTION.TOKEN_TO_META_SET,
  payload
});

export type TSetTokenValue = typeof setTokenValue;
export const setTokenValue = (
  payload: SetTokenValueMetaAction['payload']
): SetTokenValueMetaAction => ({
  type: TRANSACTION.TOKEN_VALUE_META_SET,
  payload
});

export type TSetUnitMeta = typeof setUnitMeta;
export const setUnitMeta = (payload: SetUnitMetaAction['payload']): SetUnitMetaAction => ({
  type: TRANSACTION.UNIT_META_SET,
  payload
});

export type TSetAsContractInteraction = typeof setAsContractInteraction;
export const setAsContractInteraction = (): SetAsContractInteractionAction => ({
  type: TRANSACTION.IS_CONTRACT_INTERACTION
});

export type TSetAsViewAndSend = typeof setAsViewAndSend;
export const setAsViewAndSend = (): SetAsViewAndSendAction => ({
  type: TRANSACTION.IS_VIEW_AND_SEND
});
