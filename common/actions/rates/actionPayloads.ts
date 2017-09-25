import { handleJSONResponse } from 'api/utils';

const symbols = ['USD', 'EUR', 'GBP', 'BTC', 'CHF', 'REP'];
const symbolsURL = symbols.join(',');
// TODO - internationalize
const ERROR_MESSAGE = 'Could not fetch rate data.';

export const fetchRates = (): Promise<any> =>
  fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=${symbolsURL}`
  ).then(response => handleJSONResponse(response, ERROR_MESSAGE));
