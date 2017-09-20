import { Token } from 'config/data';

/*** Add custom token ***/
export interface AddCustomTokenAction {
  type: 'CUSTOM_TOKEN_ADD';
  payload: Token;
}

export function addCustomToken(payload: Token): AddCustomTokenAction {
  return {
    type: 'CUSTOM_TOKEN_ADD',
    payload
  };
}

/*** Remove Custom Token ***/
export interface RemoveCustomTokenAction {
  type: 'CUSTOM_TOKEN_REMOVE';
  payload: string;
}

export function removeCustomToken(payload: string): RemoveCustomTokenAction {
  return {
    type: 'CUSTOM_TOKEN_REMOVE',
    payload
  };
}

/*** Union Type ***/
export type CustomTokenAction = AddCustomTokenAction | RemoveCustomTokenAction;
