import { handleJSONResponse } from 'api/utils';

export const rateSymbols = ['USD', 'EUR', 'GBP', 'BTC', 'CHF', 'REP', 'ETH'];
// TODO - internationalize
const ERROR_MESSAGE = 'Could not fetch rate data.';
const CCApi = 'https://min-api.cryptocompare.com';

const CCRates = (symbols: string[]) => {
  const tsyms = rateSymbols.concat(symbols).join(',');
  return `${CCApi}/data/price?fsym=ETH&tsyms=${tsyms}`;
};

export interface CCResponse {
  [symbol: string]: {
    USD: number;
    EUR: number;
    GBP: number;
    BTC: number;
    CHF: number;
    REP: number;
    ETH: number;
  };
}

export const fetchRates = (symbols: string[] = []): Promise<CCResponse> =>
  fetch(CCRates(symbols))
    .then(response => handleJSONResponse(response, ERROR_MESSAGE))
    .then(rates => {
      // All currencies are in ETH right now. We'll do token -> eth -> value to
      // do it all in one request
      // to their respective rates via ETH.
      return symbols.reduce(
        (eqRates, sym) => {
          eqRates[sym] = rateSymbols.reduce((symRates, rateSym) => {
            symRates[rateSym] = 1 / rates[sym] * rates[rateSym];
            return symRates;
          }, {});
          return eqRates;
        },
        {
          ETH: {
            USD: rates.USD,
            EUR: rates.EUR,
            GBP: rates.GBP,
            BTC: rates.BTC,
            CHF: rates.CHF,
            REP: rates.REP,
            ETH: 1
          }
        }
      );
    });
