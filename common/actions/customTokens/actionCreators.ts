import { Token } from 'config/data';
import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';

export type TAddCustomToken = typeof addCustomToken;
export function addCustomToken(payload: Token): interfaces.AddCustomTokenAction {
  return {
    type: TypeKeys.CUSTOM_TOKEN_ADD,
    payload
  };
}

export type TRemoveCustomToken = typeof removeCustomToken;

export function removeCustomToken(payload: string): interfaces.RemoveCustomTokenAction {
  return {
    type: TypeKeys.CUSTOM_TOKEN_REMOVE,
    payload
  };
}
