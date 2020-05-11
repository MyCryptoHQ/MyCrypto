import { Fiat, TSymbol } from '@types';

interface FiatObject {
  [key: string]: Fiat;
}

export const USD = {
  code: 'USD',
  name: 'US Dollars',
  symbol: '$' as TSymbol,
  prefix: true
};
export const EUR = {
  code: 'EUR',
  name: 'Euros',
  symbol: '€' as TSymbol,
  prefix: true
};
export const GBP = {
  code: 'GBP',
  name: 'British Pounds',
  symbol: '£' as TSymbol,
  prefix: true
};
export const RUB = {
  code: 'RUB',
  name: 'Rubles',
  symbol: '₽' as TSymbol,
  prefix: true
};
export const INR = {
  code: 'INR',
  name: 'Rupee',
  symbol: '₹' as TSymbol,
  prefix: true
};
export const CNY = {
  code: 'CNY',
  name: 'Yuan',
  symbol: '¥' as TSymbol,
  prefix: true
};
export const TRY = {
  code: 'TRY',
  name: 'Turkish Lira',
  symbol: '₺' as TSymbol,
  prefix: true
};

export const Fiats: FiatObject = { USD, EUR, GBP, RUB, INR, CNY, TRY };
