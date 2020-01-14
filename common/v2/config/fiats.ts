import { Fiat, TSymbol } from 'v2/types';

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
  symbol: '€' as TSymbol
};
export const GBP = {
  code: 'GBP',
  name: 'British Pounds',
  symbol: '£' as TSymbol
};

export const Fiats: FiatObject = { USD, EUR, GBP };
