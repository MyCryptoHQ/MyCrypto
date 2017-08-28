// @flow
import { put, call } from 'redux-saga/effects';
import type { Effect } from 'redux-saga/effects';
import { setRates } from 'actions/rates';
import { showNotification } from 'actions/notifications';

const symbols = ['USD', 'EUR', 'GBP', 'BTC', 'CHF', 'REP'];

const fetchRates = symbols =>
  fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=${symbols.join(
      ','
    )}`
  ).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Could not fetch rate data.');
  });

export default function* ratesSaga(): Generator<Effect, void, any> {
  try {
    const rates = yield call(fetchRates, symbols);
    yield put(setRates(rates));
  } catch (error) {
    const action = yield showNotification('danger', error);
    yield put(action);
  }
}
