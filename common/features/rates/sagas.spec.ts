import { call, put } from 'redux-saga/effects';

import { fetchRates } from 'api/rates';
import * as actions from './actions';
import * as sagas from './sagas';

describe('fetch rates saga success', () => {
  const saga = sagas.fetchRatesSaga(actions.fetchCCRatesRequested());
  it('should fetch the rates', () => {
    expect(saga.next().value).toEqual(call(fetchRates, []));
  });
  it('should dispatch a success action', () => {
    expect(saga.next({}).value).toEqual(put(actions.fetchCCRatesSucceeded({})));
  });
  it('should be done', () => {
    expect(saga.next().done).toEqual(true);
  });
});

describe('fetch rates saga failure', () => {
  const saga = sagas.fetchRatesSaga(actions.fetchCCRatesRequested());
  it('it should throw and dispatch a failure action', () => {
    saga.next();
    expect(saga.throw!().value).toEqual(put(actions.fetchCCRatesFailed()));
  });
  it('should be done', () => {
    expect(saga.next().done).toEqual(true);
  });
});
