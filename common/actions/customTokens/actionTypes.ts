import { TypeKeys } from './constants';
import { Token } from 'types/network';

/*** Add custom token ***/
export interface AddCustomTokenAction {
  type: TypeKeys.CUSTOM_TOKEN_ADD;
  payload: Token;
}

/*** Remove Custom Token ***/
export interface RemoveCustomTokenAction {
  type: TypeKeys.CUSTOM_TOKEN_REMOVE;
  payload: string;
}

export type CustomTokenAction = AddCustomTokenAction | RemoveCustomTokenAction;
