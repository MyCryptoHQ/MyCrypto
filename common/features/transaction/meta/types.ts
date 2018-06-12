import { Address, TokenValue } from 'libs/units';
import { TRANSACTION } from '../types';

export interface SetTokenToMetaAction {
  type: TRANSACTION.TOKEN_TO_META_SET;
  payload: {
    raw: string;
    value: Address | null;
  };
}

export interface SetUnitMetaAction {
  type: TRANSACTION.UNIT_META_SET;
  payload: string;
}

export interface SetTokenValueMetaAction {
  type: TRANSACTION.TOKEN_VALUE_META_SET;
  payload: {
    raw: string;
    value: TokenValue | null;
  };
}

export interface SetAsContractInteractionAction {
  type: TRANSACTION.IS_CONTRACT_INTERACTION;
}

export interface SetAsViewAndSendAction {
  type: TRANSACTION.IS_VIEW_AND_SEND;
}

export type TransactionMetaAction =
  | SetUnitMetaAction
  | SetTokenValueMetaAction
  | SetTokenToMetaAction;
export type TransactionTypeMetaAction = SetAsContractInteractionAction | SetAsViewAndSendAction;

export type MetaAction = TransactionMetaAction | TransactionTypeMetaAction;
