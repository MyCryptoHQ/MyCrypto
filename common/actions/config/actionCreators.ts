import * as constants from './constants';
import * as interfaces from './actionTypes';

export function changeLanguage(sign: string): interfaces.ChangeLanguageAction {
    return {
        type: constants.CONFIG_LANGUAGE_CHANGE,
        value: sign
    };
}

export function changeNode(value: string): interfaces.ChangeNodeAction {
    return {
        type: constants.CONFIG_NODE_CHANGE,
        value
    };
}

export function changeGasPrice(value: number): interfaces.ChangeGasPriceAction {
    return {
        type: constants.CONFIG_GAS_PRICE,
        value
    };
}
