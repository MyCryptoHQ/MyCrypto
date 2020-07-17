import { Fiat, TCode, TSymbol, ISettings } from '@types';

interface FiatObject {
  [key: string]: Fiat;
}

export const USD = {
  code: 'USD' as TCode,
  name: 'US Dollars',
  symbol: '$' as TSymbol
};
export const EUR = {
  code: 'EUR' as TCode,
  name: 'Euros',
  symbol: '€' as TSymbol
};
export const GBP = {
  code: 'GBP' as TCode,
  name: 'British Pounds',
  symbol: '£' as TSymbol
};
export const RUB = {
  code: 'RUB' as TCode,
  name: 'Rubles',
  symbol: '₽' as TSymbol
};
export const INR = {
  code: 'INR' as TCode,
  name: 'Rupee',
  symbol: '₹' as TSymbol
};
export const CNY = {
  code: 'CNY' as TCode,
  name: 'Yuan',
  symbol: '¥' as TSymbol
};
export const TRY = {
  code: 'TRY' as TCode,
  name: 'Turkish Lira',
  symbol: '₺' as TSymbol
};

export const Fiats: FiatObject = { USD, EUR, GBP, RUB, INR, CNY, TRY };

export const getFiat = (settings: ISettings) => Fiats[settings.fiatCurrency];
