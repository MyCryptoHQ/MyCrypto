// @flow
export const CONFIG_LANGUAGE_CHANGE = 'CONFIG_LANGUAGE_CHANGE';
export const CONFIG_NODE_CHANGE = 'CONFIG_NODE_CHANGE';


export const CHANGE_LANGUAGE = (value: any) => Object({
    type: CONFIG_LANGUAGE_CHANGE, value
})

export const CHANGE_NODE = (value: any) => Object({
    type: CONFIG_NODE_CHANGE, value
})
