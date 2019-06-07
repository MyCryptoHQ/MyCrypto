import { create, read, update, destroy, readAll } from 'v2/services/LocalCache';

export const createContracts = create('contracts');
export const readContracts = read('contracts');
export const updateContracts = update('contracts');
export const deleteContracts = destroy('contracts');
export const readAllContracts = readAll('contracts');
