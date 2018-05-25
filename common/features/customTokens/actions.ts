import { Token } from 'types/network';
import { CUSTOM_TOKEN, AddCustomTokenAction, RemoveCustomTokenAction } from './types';

export type TAddCustomToken = typeof addCustomToken;
export function addCustomToken(payload: Token): AddCustomTokenAction {
  return {
    type: CUSTOM_TOKEN.ADD,
    payload
  };
}

export type TRemoveCustomToken = typeof removeCustomToken;

export function removeCustomToken(payload: string): RemoveCustomTokenAction {
  return {
    type: CUSTOM_TOKEN.REMOVE,
    payload
  };
}

export default {
  addCustomToken,
  removeCustomToken
};
