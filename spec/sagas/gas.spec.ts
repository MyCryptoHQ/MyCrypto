import { fetchEstimates, setDefaultEstimates } from 'sagas/gas';
import { call, put, select } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import { fetchGasEstimates, GasEstimates } from 'api/gas';
import { setGasEstimates } from 'actions/gas';
import { getEstimates } from 'selectors/gas';
import { getOffline, getNetworkConfig } from 'selectors/config';
import { gasPriceDefaults, gasEstimateCacheTime } from 'config';
import { staticNetworks } from 'reducers/config/networks/staticNetworks';

const networkState = staticNetworks(undefined, {} as any);
const network = networkState.ETH;
const nonEstimateNetwork = networkState.ETC;

describe('fetchEstimates*', () => {
  const gen = cloneableGenerator(fetchEstimates)();
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
    expect(gen.next().value).toEqual(select(getNetworkConfig));
  });

  it('Should use network default gas price settings if network shouldn’t estimate', () => {
    const noEstimateGen = gen.clone();
    expect(noEstimateGen.next(nonEstimateNetwork).value).toEqual(
      call(setDefaultEstimates, nonEstimateNetwork)
    );
    expect(noEstimateGen.next().done).toBeTruthy();
  });

  it('Should select getOffline', () => {
    expect(gen.next(network).value).toEqual(select(getOffline));
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

  it('Should use new estimates if chainId changed, even if time is similar', () => {
    const newChainGen = gen.clone();
    expect(newChainGen.next(newChainIdEstimates).value).toEqual(
      put(setGasEstimates(newChainIdEstimates))
    );
    expect(newChainGen.next().done).toBeTruthy();
  });

  it('Should use fetched estimates', () => {
    expect(gen.next(newTimeEstimates).value).toEqual(put(setGasEstimates(newTimeEstimates)));
    expect(gen.next().done).toBeTruthy();
  });
});

describe('setDefaultEstimates*', () => {
  const time = Date.now();

  it('Should put setGasEstimates with config defaults', () => {
    const gen = setDefaultEstimates(network);
    gen.next();
    expect(gen.next(time).value).toEqual(
      put(
        setGasEstimates({
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
    const gen = setDefaultEstimates(customNetwork);

    gen.next();
    expect(gen.next(time).value).toEqual(
      put(
        setGasEstimates({
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
