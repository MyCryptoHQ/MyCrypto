import { Token } from 'types/network';
import * as customTokensTypes from './types';

export type TAddCustomToken = typeof addCustomToken;
export function addCustomToken(payload: Token): customTokensTypes.AddCustomTokenAction {
  return {
    type: customTokensTypes.CustomTokensActions.ADD,
    payload
  };
}

export type TRemoveCustomToken = typeof removeCustomToken;

export function removeCustomToken(payload: string): customTokensTypes.RemoveCustomTokenAction {
  return {
    type: customTokensTypes.CustomTokensActions.REMOVE,
    payload
  };
}

export default {
  addCustomToken,
  removeCustomToken
};
