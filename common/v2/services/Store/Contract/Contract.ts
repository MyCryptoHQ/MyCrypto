import { create, read, update, destroy, readAll } from '../Cache';

export const createContract = create('contracts');
export const readContracts = read('contracts');
export const updateContracts = update('contracts');
export const deleteContracts = destroy('contracts');
export const readAllContracts = readAll('contracts');
