import { Fiat, TTicker, TSymbol, ISettings } from '@types';

interface FiatObject {
  [key: string]: Fiat;
}

export const USD = {
  code: 'USD' as TTicker,
  name: 'US Dollars',
  symbol: '$' as TSymbol
};
export const EUR = {
  code: 'EUR' as TTicker,
  name: 'Euros',
  symbol: '€' as TSymbol
};
export const GBP = {
  code: 'GBP' as TTicker,
  name: 'British Pounds',
  symbol: '£' as TSymbol
};
export const RUB = {
  code: 'RUB' as TTicker,
  name: 'Rubles',
  symbol: '₽' as TSymbol
};
export const INR = {
  code: 'INR' as TTicker,
  name: 'Rupee',
  symbol: '₹' as TSymbol
};
export const CNY = {
  code: 'CNY' as TTicker,
  name: 'Yuan',
  symbol: '¥' as TSymbol
};
export const TRY = {
  code: 'TRY' as TTicker,
  name: 'Turkish Lira',
  symbol: '₺' as TSymbol
};

export const Fiats: FiatObject = { USD, EUR, GBP, RUB, INR, CNY, TRY };

export const getFiat = (settings: ISettings) => Fiats[settings.fiatCurrency];
