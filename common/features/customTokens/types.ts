import { Token } from 'types/network';

export type CustomTokensState = Token[];

export enum CUSTOM_TOKEN {
  ADD = 'CUSTOM_TOKEN_ADD',
  REMOVE = 'CUSTOM_TOKEN_REMOVE'
}

export interface AddCustomTokenAction {
  type: CUSTOM_TOKEN.ADD;
  payload: Token;
}

export interface RemoveCustomTokenAction {
  type: CUSTOM_TOKEN.REMOVE;
  payload: string;
}

export type CustomTokenAction = AddCustomTokenAction | RemoveCustomTokenAction;
