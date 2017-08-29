// @flow
import { put, call } from 'redux-saga/effects';
import type { Effect } from 'redux-saga/effects';
import { setRates } from 'actions/rates';

const symbols = ['USD', 'EUR', 'GBP', 'BTC', 'CHF', 'REP'];

function fetchRates(symbols) {
  return fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=${symbols.join(
      ','
    )}`
  ).then(r => r.json());
}

export default function* ratesSaga(): Generator<Effect, void, any> {
  try {
    const rates = yield call(fetchRates, symbols);
    yield put(setRates(rates));
  } catch (error) {
    yield put({ type: 'fetchRates_error', error });
  }
}
