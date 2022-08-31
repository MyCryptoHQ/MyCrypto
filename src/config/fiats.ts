import { Fiat, ISettings, TCurrencySymbol, TFiatTicker } from '@types';

interface FiatObject {
  [key: string]: Fiat;
}

export const USD = {
  ticker: 'USD' as TFiatTicker,
  name: 'US Dollars',
  symbol: '$' as TCurrencySymbol
};
export const EUR = {
  ticker: 'EUR' as TFiatTicker,
  name: 'Euros',
  symbol: '€' as TCurrencySymbol
};
export const GBP = {
  ticker: 'GBP' as TFiatTicker,
  name: 'British Pounds',
  symbol: '£' as TCurrencySymbol
};
export const RUB = {
  ticker: 'RUB' as TFiatTicker,
  name: 'Rubles',
  symbol: '₽' as TCurrencySymbol
};
export const INR = {
  ticker: 'INR' as TFiatTicker,
  name: 'Rupee',
  symbol: '₹' as TCurrencySymbol
};
export const CNY = {
  ticker: 'CNY' as TFiatTicker,
  name: 'Yuan',
  symbol: '¥' as TCurrencySymbol
};
export const TRY = {
  ticker: 'TRY' as TFiatTicker,
  name: 'Turkish Lira',
  symbol: '₺' as TCurrencySymbol
};
export const CAD = {
  ticker: 'CAD' as TFiatTicker,
  name: 'Canadian Dollar',
  symbol: '$' as TCurrencySymbol
};
export const DKK = {
  ticker: 'DKK' as TFiatTicker,
  name: 'Danish krone',
  symbol: 'kr' as TCurrencySymbol
};

export const Fiats: FiatObject = { USD, EUR, GBP, RUB, INR, CNY, TRY, CAD, DKK };

export const getFiat = (settings: ISettings) => Fiats[settings.fiatCurrency];
