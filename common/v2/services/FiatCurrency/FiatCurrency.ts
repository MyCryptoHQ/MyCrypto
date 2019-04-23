import { create, read, update, destroy, readAll } from 'v2/services/LocalCache';

export const createFiatCurrency = create('fiatCurrencies');
export const readFiatCurrency = read('fiatCurrencies');
export const updateFiatCurrency = update('fiatCurrencies');
export const deleteFiatCurrency = destroy('fiatCurrencies');
export const readFiatCurrencys = readAll('fiatCurrencies');
