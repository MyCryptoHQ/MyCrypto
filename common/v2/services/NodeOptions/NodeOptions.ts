import { create, read, update, destroy, readAll, createWithID } from 'v2/services/LocalCache';

export const createNodeOptions = create('nodeOptions');
export const createNodeOptionsWithID = createWithID('nodeOptions');
export const readNodeOptions = read('nodeOptions');
export const updateNodeOptions = update('nodeOptions');
export const deleteNodeOptions = destroy('nodeOptions');
export const readAllNodeOptions = readAll('nodeOptions');
