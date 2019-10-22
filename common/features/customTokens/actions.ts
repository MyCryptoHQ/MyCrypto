import { Token } from 'types/network';
import * as types from './types';

export type TAttemptAddCustomToken = typeof attemptAddCustomToken;
export function attemptAddCustomToken(payload: Token): types.AttemptAddCustomTokenAction {
  return {
    type: types.CustomTokensActions.ATTEMPT_ADD,
    payload
  };
}

export type TAddCustomToken = typeof addCustomToken;
export function addCustomToken(payload: Token): types.AddCustomTokenAction {
  return {
    type: types.CustomTokensActions.ADD,
    payload
  };
}

export type TRemoveCustomToken = typeof removeCustomToken;

export function removeCustomToken(payload: string): types.RemoveCustomTokenAction {
  return {
    type: types.CustomTokensActions.REMOVE,
    payload
  };
}
