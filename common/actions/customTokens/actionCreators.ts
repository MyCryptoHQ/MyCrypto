import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';
import { Token } from 'types/network';

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
