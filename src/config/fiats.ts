import { Fiat, TTicker, TCurrencySymbol, ISettings } from '@types';

interface FiatObject {
  [key: string]: Fiat;
}

export const USD = {
  ticker: 'USD' as TTicker,
  name: 'US Dollars',
  symbol: '$' as TCurrencySymbol
};
export const EUR = {
  ticker: 'EUR' as TTicker,
  name: 'Euros',
  symbol: '€' as TCurrencySymbol
};
export const GBP = {
  ticker: 'GBP' as TTicker,
  name: 'British Pounds',
  symbol: '£' as TCurrencySymbol
};
export const RUB = {
  ticker: 'RUB' as TTicker,
  name: 'Rubles',
  symbol: '₽' as TCurrencySymbol
};
export const INR = {
  ticker: 'INR' as TTicker,
  name: 'Rupee',
  symbol: '₹' as TCurrencySymbol
};
export const CNY = {
  ticker: 'CNY' as TTicker,
  name: 'Yuan',
  symbol: '¥' as TCurrencySymbol
};
export const TRY = {
  ticker: 'TRY' as TTicker,
  name: 'Turkish Lira',
  symbol: '₺' as TCurrencySymbol
};

export const Fiats: FiatObject = { USD, EUR, GBP, RUB, INR, CNY, TRY };

export const getFiat = (settings: ISettings) => Fiats[settings.fiatCurrency];
