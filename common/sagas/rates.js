// @flow
import { put, call } from 'redux-saga/effects';
import type { Effect } from 'redux-saga/effects';

import { ensureOKResponse } from 'api/utils';

import { setRates } from 'actions/rates';
import { showNotification } from 'actions/notifications';

const symbols = ['USD', 'EUR', 'GBP', 'BTC', 'CHF', 'REP'];
const symbolsURL = symbols.join(',');

const fetchRates = () =>
  fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=${symbolsURL}`
  )
    .then(response => ensureOKResponse(response))
    .then(data => {
      if (!data) {
        throw new Error('Could not fetch rate data.');
      }
      return data;
    });

export default function* ratesSaga(): Generator<Effect, void, any> {
  try {
    const rates = yield call(fetchRates);
    yield put(setRates(rates));
  } catch (error) {
    const action = yield showNotification('danger', error);
    yield put(action);
  }
}
