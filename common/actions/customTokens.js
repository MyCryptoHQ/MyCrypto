// @flow
import type { Token } from 'config/data';

export type AddCustomTokenAction = {
  type: 'CUSTOM_TOKEN_ADD',
  payload: Token
};

export type RemoveCustomTokenAction = {
  type: 'CUSTOM_TOKEN_REMOVE',
  payload: string
};

export type CustomTokenAction = AddCustomTokenAction | RemoveCustomTokenAction;

export function addCustomToken(payload: Token): AddCustomTokenAction {
  return {
    type: 'CUSTOM_TOKEN_ADD',
    payload
  };
}

export function removeCustomToken(payload: string): RemoveCustomTokenAction {
  return {
    type: 'CUSTOM_TOKEN_REMOVE',
    payload
  };
}
