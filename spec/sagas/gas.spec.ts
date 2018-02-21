import { fetchEstimates, setDefaultEstimates } from 'sagas/gas';
import { call, put, select } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { fetchGasEstimates, GasEstimates } from 'api/gas';
import { setGasEstimates } from 'actions/gas';
import { getEstimates } from 'selectors/gas';
import { getOffline } from 'selectors/config';
import { gasPriceDefaults, gasEstimateCacheTime } from 'config';
import { staticNetworks } from 'reducers/config/networks/staticNetworks';

const network = staticNetworks(undefined, {} as any).ETH;

describe('fetchEstimates*', () => {
  const gen = cloneableGenerator(fetchEstimates)();
  const offline = false;
  const oldEstimates: GasEstimates = {
    safeLow: 1,
    standard: 1,
    fast: 4,
    fastest: 20,
    time: Date.now() - gasEstimateCacheTime - 1000,
    isDefault: false
  };
  const newEstimates: GasEstimates = {
    safeLow: 2,
    standard: 2,
    fast: 8,
    fastest: 80,
    time: Date.now(),
    isDefault: false
  };

  it('Should select getOffline', () => {
    expect(gen.next().value).toEqual(select(getOffline));
  });

  it('Should use network default gas price settings if offline', () => {
    const offlineGen = gen.clone();
    expect(offlineGen.next(true).value).toEqual(call(setDefaultEstimates, network));
    expect(offlineGen.next().done).toBeTruthy();
  });

  it('Should select getEstimates', () => {
    expect(gen.next(offline).value).toEqual(select(getEstimates));
  });

  it('Should use cached estimates if they’re recent', () => {
    const cachedGen = gen.clone();
    const cacheEstimate = {
      ...oldEstimates,
      time: Date.now() - gasEstimateCacheTime + 1000
    };
    expect(cachedGen.next(cacheEstimate).value).toEqual(put(setGasEstimates(cacheEstimate)));
    expect(cachedGen.next().done).toBeTruthy();
  });

  it('Should fetch new estimates', () => {
    expect(gen.next(oldEstimates).value).toEqual(call(fetchGasEstimates));
  });

  it('Should use default estimates if request fails', () => {
    const failedReqGen = gen.clone();
    // Not sure why, but typescript seems to think throw might be missing.
    if (failedReqGen.throw) {
      expect(failedReqGen.throw('test').value).toEqual(call(setDefaultEstimates, network));
      expect(failedReqGen.next().done).toBeTruthy();
    } else {
      throw new Error('SagaIterator didn’t have throw');
    }
  });

  it('Should use fetched estimates', () => {
    expect(gen.next(newEstimates).value).toEqual(put(setGasEstimates(newEstimates)));
    expect(gen.next().done).toBeTruthy();
  });
});

describe('setDefaultEstimates*', () => {
  const gen = setDefaultEstimates(network);

  it('Should put setGasEstimates with config defaults', () => {
    const time = Date.now();
    gen.next();
    expect(gen.next(time).value).toEqual(
      put(
        setGasEstimates({
          safeLow: gasPriceDefaults.min,
          standard: gasPriceDefaults.initial,
          fast: gasPriceDefaults.initial,
          fastest: gasPriceDefaults.max,
          isDefault: true,
          time
        })
      )
    );
  });
});
