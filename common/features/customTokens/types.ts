import { Token } from 'types/network';

export type CustomTokensState = Token[];

export enum CustomTokensActions {
  ATTEMPT_ADD = 'CUSTOM_TOKENS_ATTEMPT_ADD',
  ADD = 'CUSTOM_TOKENS_ADD',
  REMOVE = 'CUSTOM_TOKENS_REMOVE'
}

export interface AttemptAddCustomTokenAction {
  type: CustomTokensActions.ATTEMPT_ADD;
  payload: Token;
}

export interface AddCustomTokenAction {
  type: CustomTokensActions.ADD;
  payload: Token;
}

export interface RemoveCustomTokenAction {
  type: CustomTokensActions.REMOVE;
  payload: string;
}

export type CustomTokenAction = AddCustomTokenAction | RemoveCustomTokenAction;
