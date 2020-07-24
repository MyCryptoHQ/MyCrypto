import { Fiat, TTicker, TCurrencySymbol, ISettings } from '@types';

interface FiatObject {
  [key: string]: Fiat;
}

export const USD = {
  code: 'USD' as TTicker,
  name: 'US Dollars',
  symbol: '$' as TCurrencySymbol
};
export const EUR = {
  code: 'EUR' as TTicker,
  name: 'Euros',
  symbol: '€' as TCurrencySymbol
};
export const GBP = {
  code: 'GBP' as TTicker,
  name: 'British Pounds',
  symbol: '£' as TCurrencySymbol
};
export const RUB = {
  code: 'RUB' as TTicker,
  name: 'Rubles',
  symbol: '₽' as TCurrencySymbol
};
export const INR = {
  code: 'INR' as TTicker,
  name: 'Rupee',
  symbol: '₹' as TCurrencySymbol
};
export const CNY = {
  code: 'CNY' as TTicker,
  name: 'Yuan',
  symbol: '¥' as TCurrencySymbol
};
export const TRY = {
  code: 'TRY' as TTicker,
  name: 'Turkish Lira',
  symbol: '₺' as TCurrencySymbol
};

export const Fiats: FiatObject = { USD, EUR, GBP, RUB, INR, CNY, TRY };

export const getFiat = (settings: ISettings) => Fiats[settings.fiatCurrency];
