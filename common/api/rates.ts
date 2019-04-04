import { handleJSONResponse } from 'api/utils';

interface IRateSymbols {
  symbols: {
    all: TAllSymbols;
    fiat: TFiatSymbols;
    coinAndToken: TCoinAndTokenSymbols;
  };
  isFiat: isFiat;
}

type isFiat = (rate: string) => boolean;

export type TAllSymbols = (keyof ISymbol)[];
export type TFiatSymbols = (keyof IFiatSymbols)[];
export type TCoinAndTokenSymbols = (keyof ICoinAndTokenSymbols)[];
interface ISymbol {
  USD: number;
  EUR: number;
  GBP: number;
  CHF: number;
  BTC: number;
  ETH: number;
  RUB: number;
  JPY: number;
}
interface IFiatSymbols {
  USD: number;
  EUR: number;
  GBP: number;
  CHF: number;
  RUB: number;
  JPY: number;
}
interface ICoinAndTokenSymbols {
  BTC: number;
  ETH: number;
}

const fiat: TFiatSymbols = ['USD', 'EUR', 'GBP', 'CHF', 'RUB', 'JPY'];
const coinAndToken: TCoinAndTokenSymbols = ['BTC', 'ETH'];
export const rateSymbols: IRateSymbols = {
  symbols: {
    all: [...fiat, ...coinAndToken],
    fiat,
    coinAndToken
  },
  isFiat: (rate: string) => (fiat as string[]).includes(rate)
};

// TODO - internationalize
const ERROR_MESSAGE = 'Could not fetch rate data.';
const CCApi = 'https://proxy.mycryptoapi.com/cc';

const CCRates = (symbols: string[]) => {
  const tsyms = rateSymbols.symbols.all.concat(symbols as any).join(',');
  return `${CCApi}?fsym=ETH&tsyms=${tsyms}`;
};

export interface CCResponse {
  [symbol: string]: ISymbol;
}

interface IRatesResponse {
  [key: string]: number;
}
interface IRatesError {
  Response: 'Error';
}

export const fetchRates = (symbols: string[] = []): Promise<CCResponse> =>
  fetch(CCRates(symbols))
    .then(response => handleJSONResponse(response, ERROR_MESSAGE))
    .then((rates: IRatesResponse | IRatesError) => {
      // API errors come as 200s, so check the json for error
      if ((rates as IRatesError).Response === 'Error') {
        throw new Error('Failed to fetch rates');
      }
      return rates;
    })
    .then((rates: IRatesResponse) => {
      // Sometimes the API erroneously gives tokens an extremely high value,
      // like 10000000 ETH to 1 token. Filter those out. If that ever turns
      // out to be true, we should all go home.
      return Object.keys(rates).reduce((filteredRates: IRatesResponse, key) => {
        if (rates[key] > 0.000001) {
          filteredRates[key] = rates[key];
        }
        return filteredRates;
      }, {});
    })
    .then((rates: IRatesResponse) => {
      // All currencies are in ETH right now. We'll do token -> eth -> value to
      // do it all in one request to their respective rates via ETH.
      return symbols.reduce(
        (eqRates, sym) => {
          if (rates[sym]) {
            eqRates[sym] = rateSymbols.symbols.all.reduce(
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
            CHF: rates.CHF,
            RUB: rates.RUB,
            JPY: rates.JPY,
            BTC: rates.BTC,
            ETH: 1
          }
        } as CCResponse
      );
    });
