// @flow
import { put, call, takeLatest } from 'redux-saga/effects';
import { handleJSONResponse } from 'api/utils';
import { fiatSucceededRates } from 'actions/rates';
import type { Yield, Return, Next } from 'sagas/types';

const symbols = ['USD', 'EUR', 'GBP', 'BTC', 'CHF', 'REP'];
const symbolsURL = symbols.join(',');
// TODO - internationalize
const ERROR_MESSAGE = 'Could not fetch rate data.';

const fetchRates = () =>
  fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=${symbolsURL}`
  ).then(response => handleJSONResponse(response, ERROR_MESSAGE));

export function* handleRatesRequest(): Generator<Yield, Return, Next> {
  try {
    const rates = yield call(fetchRates);
    yield put(fiatSucceededRates(rates));
  } catch (error) {
    yield put({ type: 'RATES_FIAT_FAILED', payload: error });
  }
}

export default function* ratesSaga(): Generator<Yield, Return, Next> {
  yield takeLatest('RATES_FIAT_REQUESTED', handleRatesRequest);
}
