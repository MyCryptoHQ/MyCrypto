import { create, destroy, read, readAll, update } from 'v2/services/LocalCache';

export const createAccountType = create('accountTypes');
export const readAccountType = read('accountTypes');
export const updateAccountType = update('accountTypes');
export const deleteAccountType = destroy('accountTypes');
export const readAccountTypes = readAll('accountTypes');
