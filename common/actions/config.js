// @flow

export type ChangeNodeAction = {
  type: 'CONFIG_NODE_CHANGE',
  // FIXME $keyof?
  value: string
};

export type ChangeLanguageAction = {
  type: 'CONFIG_LANGUAGE_CHANGE',
  value: string
};

export type ConfigAction = ChangeNodeAction | ChangeLanguageAction;

export function changeLanguage(sign: string) {
  return {
    type: 'CONFIG_LANGUAGE_CHANGE',
    value: sign
  };
}

export function changeNode(value: string): ChangeNodeAction {
  return {
    type: 'CONFIG_NODE_CHANGE',
    value
  };
}
