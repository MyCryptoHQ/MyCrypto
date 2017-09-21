import * as interfaces from './actionTypes';
import * as constants from './constants';
import {Token} from 'config/data';

export function addCustomToken(payload: Token): interfaces.AddCustomTokenAction {
    return {
        type: constants.CUSTOM_TOKEN_ADD,
        payload
    };
}

export function removeCustomToken(payload: string): interfaces.RemoveCustomTokenAction {
    return {
        type: constants.CUSTOM_TOKEN_REMOVE,
        payload
    };
}
