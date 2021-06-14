import { AnyAction } from 'redux';
import { mockAppState } from 'test-utils';

import { TFiatTicker, TUuid } from '@types';

import {
  addDefault,
  addDefaults,
  addExcludedAsset,
  canTrackProductAnalytics,
  getDefaults,
  getExcludedAssets,
  getFiat,
  getIsDemoMode,
  getLanguage,
  initialState,
  removeExcludedAsset,
  resetDefaultsTo,
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

  it('addDefault(): adds an account uuid to Defaults', () => {
    const uuid = 'uuid1' as TUuid;
    const actual = reducer(initialState, addDefault(uuid));
    const expected = [uuid];
    expect(getDefaults(actual)).toEqual(expected);
  });

  it('addDefaults(): adds multiple account uuids to Defaults', () => {
    const toAdd = ['uuid1', 'uuid2'] as TUuid[];
    const actual = reducer(initialState, addDefaults(toAdd));
    const expected = toAdd;
    expect(getDefaults(actual)).toEqual(expected);
  });

  it('resetDefaultsTo(): replaces Defaults with new accounts', () => {
    const current = ['uuid1', 'uuid2'] as TUuid[];
    const toAdd = ['uuid3', 'uuid4'] as TUuid[];
    const actual = reducer({ ...initialState, dashboardAccounts: current }, resetDefaultsTo(toAdd));
    const expected = toAdd;
    expect(getDefaults(actual)).toEqual(expected);
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
