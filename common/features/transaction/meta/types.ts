import { Address, TokenValue } from 'libs/units';

export enum TransactionMetaActions {
  TOKEN_TO_META_SET = 'TOKEN_TO_META_SET',
  UNIT_META_SET = 'UNIT_META_SET',
  TOKEN_VALUE_META_SET = 'TOKEN_VALUE_META_SET',
  IS_CONTRACT_INTERACTION = 'IS_CONTRACT_INTERACTION',
  IS_VIEW_AND_SEND = 'IS_VIEW_AND_SEND'
}

export interface TransactionMetaState {
  unit: SetUnitMetaAction['payload'];
  previousUnit: SetUnitMetaAction['payload'];
  decimal: number;
  tokenValue: { raw: string; value: TokenValue | null }; // TODO: fix this workaround since some of the payload is optional
  tokenTo: SetTokenToMetaAction['payload'];
  from: string | null;
  isContractInteraction: boolean;
}

export interface SetTokenToMetaAction {
  type: TransactionMetaActions.TOKEN_TO_META_SET;
  payload: {
    raw: string;
    value: Address | null;
  };
}

export interface SetUnitMetaAction {
  type: TransactionMetaActions.UNIT_META_SET;
  payload: string;
}

export interface SetTokenValueMetaAction {
  type: TransactionMetaActions.TOKEN_VALUE_META_SET;
  payload: {
    raw: string;
    value: TokenValue | null;
  };
}

export interface SetAsContractInteractionAction {
  type: TransactionMetaActions.IS_CONTRACT_INTERACTION;
}

export interface SetAsViewAndSendAction {
  type: TransactionMetaActions.IS_VIEW_AND_SEND;
}

export type TransactionMetaAction =
  | SetUnitMetaAction
  | SetTokenValueMetaAction
  | SetTokenToMetaAction;

export type TransactionTypeMetaAction = SetAsContractInteractionAction | SetAsViewAndSendAction;

export type MetaAction = TransactionMetaAction | TransactionTypeMetaAction;
