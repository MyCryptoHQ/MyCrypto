import { handleJSONResponse } from 'api/utils';

export const rateSymbols: Symbols = ['USD', 'EUR', 'GBP', 'BTC', 'CHF', 'REP', 'ETH'];

export type Symbols = (keyof ISymbol)[];
// TODO - internationalize
const ERROR_MESSAGE = 'Could not fetch rate data.';
const CCApi = 'https://min-api.cryptocompare.com';

const CCRates = (symbols: string[]) => {
  const tsyms = rateSymbols.concat(symbols as any).join(',');
  return `${CCApi}/data/price?fsym=ETH&tsyms=${tsyms}`;
};

export interface CCResponse {
  [symbol: string]: ISymbol;
}

interface ISymbol {
  USD: number;
  EUR: number;
  GBP: number;
  BTC: number;
  CHF: number;
  REP: number;
  ETH: number;
}

interface IRates extends ISymbol {
  Response?: 'Error';
}

export const fetchRates = (symbols: string[] = []): Promise<CCResponse> =>
  fetch(CCRates(symbols))
    .then(response => handleJSONResponse(response, ERROR_MESSAGE))
    .then((rates: IRates) => {
      // API errors come as 200s, so check the json for error
      if (rates.Response && rates.Response === 'Error') {
        throw new Error('Failed to fetch rates');
      }

      // All currencies are in ETH right now. We'll do token -> eth -> value to
      // do it all in one request
      // to their respective rates via ETH.
      return symbols.reduce(
        (eqRates, sym: keyof ISymbol) => {
          if (rates[sym]) {
            eqRates[sym] = rateSymbols.reduce(
              (symRates, rateSym) => {
                symRates[rateSym] = 1 / rates[sym] * rates[rateSym];
                return symRates;
              },
              {} as ISymbol
            );
          }
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
        } as CCResponse
      );
    });
