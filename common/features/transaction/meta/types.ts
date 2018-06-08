import { Address, TokenValue } from 'libs/units';
import { TypeKeys } from '../types';

export interface SetTokenToMetaAction {
  type: TypeKeys.TOKEN_TO_META_SET;
  payload: {
    raw: string;
    value: Address | null;
  };
}

export interface SetUnitMetaAction {
  type: TypeKeys.UNIT_META_SET;
  payload: string;
}

export interface SetTokenValueMetaAction {
  type: TypeKeys.TOKEN_VALUE_META_SET;
  payload: {
    raw: string;
    value: TokenValue | null;
  };
}

export interface SetAsContractInteractionAction {
  type: TypeKeys.IS_CONTRACT_INTERACTION;
}

export interface SetAsViewAndSendAction {
  type: TypeKeys.IS_VIEW_AND_SEND;
}

export type TransactionMetaAction =
  | SetUnitMetaAction
  | SetTokenValueMetaAction
  | SetTokenToMetaAction;
export type TransactionTypeMetaAction = SetAsContractInteractionAction | SetAsViewAndSendAction;

export type MetaAction = TransactionMetaAction | TransactionTypeMetaAction;
