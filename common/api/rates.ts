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
  REP: number;
}
interface IFiatSymbols {
  USD: number;
  EUR: number;
  GBP: number;
  CHF: number;
}
interface ICoinAndTokenSymbols {
  BTC: number;
  ETH: number;
  REP: number;
}

const fiat: TFiatSymbols = ['USD', 'EUR', 'GBP', 'CHF'];
const coinAndToken: TCoinAndTokenSymbols = ['BTC', 'ETH', 'REP'];
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
const CCApi = 'https://min-api.cryptocompare.com';

const CCRates = (symbols: string[]) => {
  const tsyms = rateSymbols.symbols.all.concat(symbols as any).join(',');
  return `${CCApi}/data/price?fsym=ETH&tsyms=${tsyms}`;
};

export interface CCResponse {
  [symbol: string]: ISymbol;
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
            BTC: rates.BTC,
            ETH: 1,
            REP: rates.REP
          }
        } as CCResponse
      );
    });
