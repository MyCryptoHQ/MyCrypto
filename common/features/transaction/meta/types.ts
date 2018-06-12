import { Address, TokenValue } from 'libs/units';

export enum TRANSACTION_META {
  TOKEN_TO_META_SET = 'TOKEN_TO_META_SET',
  UNIT_META_SET = 'UNIT_META_SET',
  TOKEN_VALUE_META_SET = 'TOKEN_VALUE_META_SET',
  IS_CONTRACT_INTERACTION = 'IS_CONTRACT_INTERACTION',
  IS_VIEW_AND_SEND = 'IS_VIEW_AND_SEND'
}

export interface SetTokenToMetaAction {
  type: TRANSACTION_META.TOKEN_TO_META_SET;
  payload: {
    raw: string;
    value: Address | null;
  };
}

export interface SetUnitMetaAction {
  type: TRANSACTION_META.UNIT_META_SET;
  payload: string;
}

export interface SetTokenValueMetaAction {
  type: TRANSACTION_META.TOKEN_VALUE_META_SET;
  payload: {
    raw: string;
    value: TokenValue | null;
  };
}

export interface SetAsContractInteractionAction {
  type: TRANSACTION_META.IS_CONTRACT_INTERACTION;
}

export interface SetAsViewAndSendAction {
  type: TRANSACTION_META.IS_VIEW_AND_SEND;
}

export type TransactionMetaAction =
  | SetUnitMetaAction
  | SetTokenValueMetaAction
  | SetTokenToMetaAction;
export type TransactionTypeMetaAction = SetAsContractInteractionAction | SetAsViewAndSendAction;

export type MetaAction = TransactionMetaAction | TransactionTypeMetaAction;
