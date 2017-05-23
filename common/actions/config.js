// @flow
export const CONFIG_LANGUAGE_CHANGE = 'CONFIG_LANGUAGE_CHANGE';
export const CONFIG_LANGUAGE_DROPDOWN_TOGGLE = 'CONFIG_LANGUAGE_DROPDOWN_TOGGLE';
export const CONFIG_NODE_CHANGE = 'CONFIG_NODE_CHANGE';
export const CONFIG_NODE_DROPDOWN_TOGGLE = 'CONFIG_NODE_DROPDOWN_TOGGLE';


export const CHANGE_LANGUAGE = (index: number) => Object({
    type: CONFIG_LANGUAGE_CHANGE, index: index
})

export const TOGGLE_LANGUAGE_DROPDOWN = () => Object({
    type: CONFIG_LANGUAGE_DROPDOWN_TOGGLE
})

export const CHANGE_NODE = (index: number) => Object({
    type: CONFIG_NODE_CHANGE, index: index
})

export const TOGGLE_NODE_DROPDOWN = () => Object({
    type: CONFIG_NODE_DROPDOWN_TOGGLE
})