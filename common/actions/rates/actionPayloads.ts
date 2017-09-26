import { handleJSONResponse } from 'api/utils';

export const symbols = ['USD', 'EUR', 'GBP', 'BTC', 'CHF', 'REP'];
const symbolsURL = symbols.join(',');
// TODO - internationalize
const ERROR_MESSAGE = 'Could not fetch rate data.';
const CCApi = 'https://min-api.cryptocompare.com';

const CCRates = CCSymbols => `${CCApi}/data/price?fsym=ETH&tsyms=${CCSymbols}`;

export interface CCResponse {
  BTC: number;
  EUR: number;
  GBP: number;
  CHF: number;
  REP: number;
}

export const fetchRates = (): Promise<CCResponse> =>
  fetch(CCRates(symbolsURL)).then(response =>
    handleJSONResponse(response, ERROR_MESSAGE)
  );
