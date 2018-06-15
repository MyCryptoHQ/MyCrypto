import { call, put } from 'redux-saga/effects';

import { fetchRates } from 'api/rates';
import * as ratesActions from './actions';
import * as ratesSagas from './sagas';

describe('fetch rates saga success', () => {
  const saga = ratesSagas.fetchRatesSaga(ratesActions.fetchCCRatesRequested());
  it('should fetch the rates', () => {
    expect(saga.next().value).toEqual(call(fetchRates, []));
  });
  it('should dispatch a success action', () => {
    expect(saga.next({}).value).toEqual(put(ratesActions.fetchCCRatesSucceeded({})));
  });
  it('should be done', () => {
    expect(saga.next().done).toEqual(true);
  });
});

describe('fetch rates saga failure', () => {
  const saga = ratesSagas.fetchRatesSaga(ratesActions.fetchCCRatesRequested());
  it('it should throw and dispatch a failure action', () => {
    saga.next();
    expect(saga.throw!().value).toEqual(put(ratesActions.fetchCCRatesFailed()));
  });
  it('should be done', () => {
    expect(saga.next().done).toEqual(true);
  });
});
