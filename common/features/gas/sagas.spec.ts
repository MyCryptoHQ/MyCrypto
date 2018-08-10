import { call, put, select } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';

import { gasPriceDefaults, gasEstimateCacheTime } from 'config';
import { fetchGasEstimates, GasEstimates } from 'api/gas';
import * as configMetaSelectors from 'features/config/meta/selectors';
import * as configNetworksStaticReducer from 'features/config/networks/static/reducer';
import * as configSelectors from 'features/config/selectors';
import * as actions from './actions';
import * as selectors from './selectors';
import * as sagas from './sagas';

const networkState = configNetworksStaticReducer.staticNetworksReducer(undefined, {} as any);
const network = networkState.ETH;
const nonEstimateNetwork = networkState.ETC;

describe('fetchEstimates*', () => {
  const gen = cloneableGenerator(sagas.fetchEstimates)();
  const offline = false;
  const oldEstimates: GasEstimates = {
    safeLow: 1,
    standard: 1,
    fast: 4,
    fastest: 20,
    time: Date.now() - gasEstimateCacheTime - 1000,
    chainId: network.chainId,
    isDefault: false
  };
  const newTimeEstimates: GasEstimates = {
    safeLow: 2,
    standard: 2,
    fast: 8,
    fastest: 80,
    time: Date.now(),
    chainId: network.chainId,
    isDefault: false
  };
  const newChainIdEstimates: GasEstimates = {
    ...oldEstimates,
    chainId: network.chainId + 1
  };

  it('Should select getNetworkConfig', () => {
    expect(gen.next().value).toEqual(select(configSelectors.getNetworkConfig));
  });

  it('Should use network default gas price settings if network shouldn’t estimate', () => {
    const noEstimateGen = gen.clone();
    expect(noEstimateGen.next(nonEstimateNetwork).value).toEqual(
      call(sagas.setDefaultEstimates, nonEstimateNetwork)
    );
    expect(noEstimateGen.next().done).toBeTruthy();
  });

  it('Should select getOffline', () => {
    expect(gen.next(network).value).toEqual(select(configMetaSelectors.getOffline));
  });

  it('Should use network default gas price settings if offline', () => {
    const offlineGen = gen.clone();
    expect(offlineGen.next(true).value).toEqual(call(sagas.setDefaultEstimates, network));
    expect(offlineGen.next().done).toBeTruthy();
  });

  it('Should select getEstimates', () => {
    expect(gen.next(offline).value).toEqual(select(selectors.getEstimates));
  });

  it('Should use cached estimates if they’re recent', () => {
    const cachedGen = gen.clone();
    const cacheEstimate = {
      ...oldEstimates,
      time: Date.now() - gasEstimateCacheTime + 1000
    };
    expect(cachedGen.next(cacheEstimate).value).toEqual(
      put(actions.setGasEstimates(cacheEstimate))
    );
    expect(cachedGen.next().done).toBeTruthy();
  });

  it('Should fetch new estimates', () => {
    expect(gen.next(oldEstimates).value).toEqual(call(fetchGasEstimates));
  });

  it('Should use default estimates if request fails', () => {
    const failedReqGen = gen.clone();
    // Not sure why, but typescript seems to think throw might be missing.
    if (failedReqGen.throw) {
      expect(failedReqGen.throw('test').value).toEqual(call(sagas.setDefaultEstimates, network));
      expect(failedReqGen.next().done).toBeTruthy();
    } else {
      throw new Error('SagaIterator didn’t have throw');
    }
  });

  it('Should use new estimates if chainId changed, even if time is similar', () => {
    const newChainGen = gen.clone();
    expect(newChainGen.next(newChainIdEstimates).value).toEqual(
      put(actions.setGasEstimates(newChainIdEstimates))
    );
    expect(newChainGen.next().done).toBeTruthy();
  });

  it('Should use fetched estimates', () => {
    expect(gen.next(newTimeEstimates).value).toEqual(
      put(actions.setGasEstimates(newTimeEstimates))
    );
    expect(gen.next().done).toBeTruthy();
  });
});

describe('setDefaultEstimates*', () => {
  const time = Date.now();

  it('Should put setGasEstimates with config defaults', () => {
    const gen = sagas.setDefaultEstimates(network);
    gen.next();
    expect(gen.next(time).value).toEqual(
      put(
        actions.setGasEstimates({
          safeLow: network.gasPriceSettings.min,
          standard: network.gasPriceSettings.initial,
          fast: network.gasPriceSettings.initial,
          fastest: network.gasPriceSettings.max,
          chainId: network.chainId,
          isDefault: true,
          time
        })
      )
    );
  });

  it('Should use config defaults if network has no defaults', () => {
    const customNetwork = {
      isCustom: true as true,
      id: '123',
      name: 'Custom',
      unit: 'CST',
      chainId: 123,
      dPathFormats: null
    };
    const gen = sagas.setDefaultEstimates(customNetwork);

    gen.next();
    expect(gen.next(time).value).toEqual(
      put(
        actions.setGasEstimates({
          safeLow: gasPriceDefaults.min,
          standard: gasPriceDefaults.initial,
          fast: gasPriceDefaults.initial,
          fastest: gasPriceDefaults.max,
          chainId: customNetwork.chainId,
          isDefault: true,
          time
        })
      )
    );
  });
});
