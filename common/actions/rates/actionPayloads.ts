import { handleJSONResponse } from 'api/utils';

export const rateSymbols = ['USD', 'EUR', 'GBP', 'BTC', 'CHF', 'REP', 'ETH'];
const rateSymbolsArg = rateSymbols.join(',');
// TODO - internationalize
const ERROR_MESSAGE = 'Could not fetch rate data.';
const CCApi = 'https://min-api.cryptocompare.com';

const CCRates = (symbol: string) => {
  return `${CCApi}/data/price?fsym=${symbol}&tsyms=${rateSymbolsArg}`;
};

export interface CCResponse {
  symbol: string;
  rates: {
    BTC: number;
    EUR: number;
    GBP: number;
    CHF: number;
    REP: number;
    ETH: number;
  };
}

export const fetchRates = (symbol: string): Promise<CCResponse> =>
  fetch(CCRates(symbol))
    .then(response => handleJSONResponse(response, ERROR_MESSAGE))
    .then(rates => ({
      symbol,
      rates
    }));
