import { Fiat, TSymbol, ISettings } from '@types';

interface FiatObject {
  [key: string]: Fiat;
}

export const USD = {
  code: 'USD',
  name: 'US Dollars',
  symbol: '$' as TSymbol
};
export const EUR = {
  code: 'EUR',
  name: 'Euros',
  symbol: '€' as TSymbol
};
export const GBP = {
  code: 'GBP',
  name: 'British Pounds',
  symbol: '£' as TSymbol
};
export const RUB = {
  code: 'RUB',
  name: 'Rubles',
  symbol: '₽' as TSymbol
};
export const INR = {
  code: 'INR',
  name: 'Rupee',
  symbol: '₹' as TSymbol
};
export const CNY = {
  code: 'CNY',
  name: 'Yuan',
  symbol: '¥' as TSymbol
};
export const TRY = {
  code: 'TRY',
  name: 'Turkish Lira',
  symbol: '₺' as TSymbol
};

export const Fiats: FiatObject = { USD, EUR, GBP, RUB, INR, CNY, TRY };

export const getFiat = (settings: ISettings) => Fiats[settings.fiatCurrency];
