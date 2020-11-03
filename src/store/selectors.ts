import { LSKeys } from '@types';

export const getAccounts = (state: any) => state.entities[LSKeys.ACCOUNTS];
export const getAssets = (state: any) => state.entities[LSKeys.ASSETS];
export const getContacts = (state: any) => state.entities[LSKeys.ADDRESS_BOOK];
