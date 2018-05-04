import { Token } from 'types/network';

export enum TypeKeys {
  CUSTOM_TOKEN_ADD = 'CUSTOM_TOKEN_ADD',
  CUSTOM_TOKEN_REMOVE = 'CUSTOM_TOKEN_REMOVE'
}

export interface AddCustomTokenAction {
  type: TypeKeys.CUSTOM_TOKEN_ADD;
  payload: Token;
}

export interface RemoveCustomTokenAction {
  type: TypeKeys.CUSTOM_TOKEN_REMOVE;
  payload: string;
}

export type CustomTokenAction = AddCustomTokenAction | RemoveCustomTokenAction;
