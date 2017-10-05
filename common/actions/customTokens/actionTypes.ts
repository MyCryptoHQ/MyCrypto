import { Token } from 'config/data';
import { TypeKeys } from './constants';
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
