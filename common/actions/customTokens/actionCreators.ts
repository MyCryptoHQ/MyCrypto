import { Token } from 'config/data';
import * as interfaces from './actionTypes';
import * as constants from './constants';

export type TAddCustomToken = typeof addCustomToken;
export function addCustomToken(
  payload: Token
): interfaces.AddCustomTokenAction {
  return {
    type: constants.CUSTOM_TOKEN_ADD,
    payload
  };
}

export type TRemoveCustomToken = typeof removeCustomToken;

export function removeCustomToken(
  payload: string
): interfaces.RemoveCustomTokenAction {
  return {
    type: constants.CUSTOM_TOKEN_REMOVE,
    payload
  };
}
