// @flow
import { put, call } from 'redux-saga/effects';

import { handleJSONResponse } from 'api/utils';

import { setRates } from 'actions/rates';
import { showNotification } from 'actions/notifications';

import type { Yield, Return, Next } from 'sagas/types';

const symbols = ['USD', 'EUR', 'GBP', 'BTC', 'CHF', 'REP'];
const symbolsURL = symbols.join(',');

const fetchRates = () =>
  fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=${symbolsURL}`
  ).then(response =>
    handleJSONResponse(response, 'Could not fetch rate data.')
  );

export default function* ratesSaga(): Generator<Yield, Return, Next> {
  try {
    const rates = yield call(fetchRates);
    yield put(setRates(rates));
  } catch (error) {
    yield put(showNotification('danger', error));
  }
}
