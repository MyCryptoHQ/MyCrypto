import { AnyAction } from 'redux';
import { call } from 'redux-saga-test-plan/matchers';
import { expectSaga, mockAppState } from 'test-utils';

import { Fiats } from '@config';
import { fAccounts, fAssets, fRates } from '@fixtures';
import { default as RatesService } from '@services/ApiService/Rates/Rates';

import { default as accountSlice, initialState as initialAccountSliceState } from './account.slice';
import { default as assetSlice } from './asset.slice';
import {
  fetchRates,
  getCoingeckoIdsMapping,
  getRates,
  initialState,
  setRates,
  default as slice
} from './rates.slice';
import {
  initialState as initialTrackedAssetsSliceState,
  trackAsset,
  default as trackedAssetsSlice
} from './trackedAssets.slice';

const reducer = (sliceState: ReturnType<typeof slice.reducer> | undefined, action: AnyAction) => {
  return mockAppState({
    [slice.name]: slice.reducer(sliceState, action)
  });
};

describe('ratesSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(mockAppState({ [slice.name]: expected }));
  });

  it('setRates(): sets rates', () => {
    const rates = fRates;
    const actual = slice.reducer(initialState, setRates(rates));
    expect(actual).toEqual(fRates);
  });

  it("getRates(): get store's rates", () => {
    const rates = fRates;
    const actual = reducer(initialState, setRates(rates));
    expect(getRates(actual)).toEqual(rates);
  });

  it('getCoingeckoIdsMapping(): get accounts and tracked assets coingecko Ids', () => {
    const state = mockAppState({
      [slice.name]: initialState,
      [accountSlice.name]: accountSlice.reducer(
        initialAccountSliceState,
        accountSlice.actions.create({ ...fAccounts[0], assets: [fAccounts[0].assets[0]] })
      ),
      // Don't use inital assetSlice state to avoid legacyState's non-extended assets
      [assetSlice.name]: [{ ...fAssets[0], mappings: { coinGeckoId: fAssets[0].name } }],
      [trackedAssetsSlice.name]: trackedAssetsSlice.reducer(
        initialTrackedAssetsSliceState,
        trackAsset({ ...fAssets[3], mappings: { coinGeckoId: fAssets[3].name } })
      )
    });
    const expected = { [fAssets[0].uuid]: fAssets[0].name, [fAssets[3].uuid]: fAssets[3].name };
    expect(getCoingeckoIdsMapping(state)).toEqual(expected);
  });
});

describe('fetchRates()', () => {
  it('fetch rates from coinGecko', () => {
    const rates = {
      ethereum: {
        usd: 1524.39,
        eur: 1280.09,
        gbp: 1101.91,
        rub: 113360,
        inr: 111613,
        cny: 9903.65,
        try: 11487.08
      }
    };

    const initialState = mockAppState({
      accounts: [{ ...fAccounts[0], assets: [{ ...fAccounts[0].assets[0] }] }],
      assets: [{ ...fAssets[0], mappings: { coinGeckoId: fAssets[0].name } }],
      trackedAssets: {}
    });
    //@ts-expect-error wrong typing for sagas
    return expectSaga(fetchRates)
      .withState(initialState)
      .provide([[call.fn(RatesService.fetchAssetsRates), rates]])
      .select(getCoingeckoIdsMapping)
      .call(RatesService.fetchAssetsRates, [fAssets[0].name], Object.keys(Fiats))
      .put(setRates({}))
      .silentRun();
  });
});
