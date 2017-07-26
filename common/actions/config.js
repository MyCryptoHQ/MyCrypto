// @flow
export type ChangeNodeAction = {
  type: 'CONFIG_NODE_CHANGE',
  // FIXME $keyof?
  node: string
};

export type ChangeLanguageAction = {
  type: 'CONFIG_LANGUAGE_CHANGE',
  language: string
};

export type ChangeGasPriceAction = {
  type: 'CONFIG_GAS_PRICE_CHANGE',
  gasPrice: number
};

export function changeLanguage(language: string) {
  return {
    type: 'CONFIG_LANGUAGE_CHANGE',
    language
  };
}

export function changeNode(node: string): ChangeNodeAction {
  return {
    type: 'CONFIG_NODE_CHANGE',
    node
  };
}

export function changeGasPrice(gasPrice: number): ChangeGasPriceAction {
  return {
    type: 'CONFIG_GAS_PRICE_CHANGE',
    gasPrice
  };
}
