import {Token} from 'config/data';

/*** Add custom token ***/
export interface AddCustomTokenAction {
    type: 'CUSTOM_TOKEN_ADD';
    payload: Token;
}

/*** Remove Custom Token ***/
export interface RemoveCustomTokenAction {
    type: 'CUSTOM_TOKEN_REMOVE';
    payload: string;
}


export type CustomTokenAction = AddCustomTokenAction | RemoveCustomTokenAction;
