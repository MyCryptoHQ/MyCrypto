import { AnyAction } from 'redux';
import { mockAppState } from 'test-utils';

import { TFiatTicker, TUuid } from '@types';

import {
  addCurrent,
  addCurrents,
  addExcludedAsset,
  canTrackProductAnalytics,
  getCurrents,
  getExcludedAssets,
  getFiat,
  getIsDemoMode,
  getLanguage,
  initialState,
  removeExcludedAsset,
  resetCurrentsTo,
  setDemoMode,
  setFiat,
  setLanguage,
  setProductAnalyticsAuthorisation,
  default as slice
} from './settings.slice';

const reducer = (sliceState: ReturnType<typeof slice.reducer> | undefined, action: AnyAction) => {
  return mockAppState({ [slice.name]: slice.reducer(sliceState, action) });
};

describe('settingsSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(mockAppState({ [slice.name]: expected }));
  });

  it('addCurrent(): adds an account uuid to Currents', () => {
    const uuid = 'uuid1' as TUuid;
    const actual = reducer(initialState, addCurrent(uuid));
    const expected = [uuid];
    expect(getCurrents(actual)).toEqual(expected);
  });

  it('addCurrents(): adds multiple account uuids to Currents', () => {
    const toAdd = ['uuid1', 'uuid2'] as TUuid[];
    const actual = reducer(initialState, addCurrents(toAdd));
    const expected = toAdd;
    expect(getCurrents(actual)).toEqual(expected);
  });

  it('resetCurrentsTo(): replaces Currents with new accounts', () => {
    const current = ['uuid1', 'uuid2'] as TUuid[];
    const toAdd = ['uuid3', 'uuid4'] as TUuid[];
    const actual = reducer({ ...initialState, dashboardAccounts: current }, resetCurrentsTo(toAdd));
    const expected = toAdd;
    expect(getCurrents(actual)).toEqual(expected);
  });

  it('setLanguage(): sets users language preference', () => {
    const lang = 'FR';
    const actual = reducer(initialState, setLanguage(lang));
    expect(getLanguage(actual)).toEqual(lang);
  });

  it('setFiat(): sets users fiat preference', () => {
    const fiat = 'EUR' as TFiatTicker;
    const actual = reducer(initialState, setFiat(fiat));
    expect(getFiat(actual)).toEqual(fiat);
  });

  it('addExcludedAsset(), adds uuid to list', () => {
    const uuid = 'uuid1' as TUuid;
    const actual = reducer(initialState, addExcludedAsset(uuid));
    const expected = [uuid];
    expect(getExcludedAssets(actual)).toEqual(expected);
  });

  it('removeExcludedAsset(), removes uuid from list', () => {
    const assets = ['uuid1', 'uuid2', 'uuid3'] as TUuid[];
    const actual = reducer(
      { ...initialState, excludedAssets: assets },
      removeExcludedAsset(assets[1])
    );
    const expected = ['uuid1', 'uuid3'];
    expect(getExcludedAssets(actual)).toEqual(expected);
  });

  it('setDemomode(), toggles demo mode in settings', () => {
    const actual = reducer({ ...initialState, isDemoMode: false }, setDemoMode(true));
    const expected = true;
    expect(getIsDemoMode(actual)).toEqual(expected);
  });

  it('setProductAnalyticsAuthorisation(): can set value to false', () => {
    const value = false;
    const actual = reducer(initialState, setProductAnalyticsAuthorisation(value));
    expect(canTrackProductAnalytics(actual)).toEqual(value);
  });

  it('setProductAnalyticsAuthorisation(): can set value to true', () => {
    const value = true;
    const actual = reducer(initialState, setProductAnalyticsAuthorisation(value));
    expect(canTrackProductAnalytics(actual)).toEqual(value);
  });
});
