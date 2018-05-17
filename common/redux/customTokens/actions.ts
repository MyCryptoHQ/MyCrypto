import { Token } from 'types/network';
import { TypeKeys, AddCustomTokenAction, RemoveCustomTokenAction } from './types';

export type TAddCustomToken = typeof addCustomToken;
export function addCustomToken(payload: Token): AddCustomTokenAction {
  return {
    type: TypeKeys.CUSTOM_TOKEN_ADD,
    payload
  };
}

export type TRemoveCustomToken = typeof removeCustomToken;

export function removeCustomToken(payload: string): RemoveCustomTokenAction {
  return {
    type: TypeKeys.CUSTOM_TOKEN_REMOVE,
    payload
  };
}

export default {
  addCustomToken,
  removeCustomToken
};
