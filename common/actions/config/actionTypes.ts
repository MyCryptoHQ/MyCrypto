/*** Change Language ***/
export interface ChangeLanguageAction {
    type: 'CONFIG_LANGUAGE_CHANGE';
    value: string;
}

/*** Change Node ***/
export interface ChangeNodeAction {
    type: 'CONFIG_NODE_CHANGE';
    // FIXME $keyof?
    value: string;
}

/*** Change gas price ***/
export interface ChangeGasPriceAction {
    type: 'CONFIG_GAS_PRICE';
    value: number;
}

/*** Union Type ***/
export type ConfigAction =
    | ChangeNodeAction
    | ChangeLanguageAction
    | ChangeGasPriceAction;
