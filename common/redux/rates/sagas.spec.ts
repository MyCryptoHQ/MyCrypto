import { call, put } from 'redux-saga/effects';
import { fetchRates } from 'api/rates';
import { fetchCCRatesSucceeded, fetchCCRatesFailed, fetchCCRatesRequested } from './actions';
import { fetchRatesSaga } from './sagas';

describe('fetch rates saga success', () => {
  const saga = fetchRatesSaga(fetchCCRatesRequested());
  it('should fetch the rates', () => {
    expect(saga.next().value).toEqual(call(fetchRates, []));
  });
  it('should dispatch a success action', () => {
    expect(saga.next({}).value).toEqual(put(fetchCCRatesSucceeded({})));
  });
  it('should be done', () => {
    expect(saga.next().done).toEqual(true);
  });
});

describe('fetch rates saga failure', () => {
  const saga = fetchRatesSaga(fetchCCRatesRequested());
  it('it should throw and dispatch a failure action', () => {
    saga.next();
    expect(saga.throw!().value).toEqual(put(fetchCCRatesFailed()));
  });
  it('should be done', () => {
    expect(saga.next().done).toEqual(true);
  });
});
