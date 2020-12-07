import { AnyAction } from 'redux';

import { fRates } from '@fixtures';
import { TFiatTicker, TUuid } from '@types';

import { AppState, DATA_STATE_KEY } from './reducer';
import {
  addExcludedAsset,
  addFavorite,
  addFavorites,
  getExcludedAssets,
  getFavorites,
  getFiat,
  getInactivityTimer,
  getLanguage,
  getRates,
  initialState,
  removeExcludedAsset,
  resetFavoritesTo,
  setFiat,
  setInactivityTimer,
  setLanguage,
  setRates,
  default as slice
} from './settings.slice';

const withAppState = (sliceState: typeof initialState) => {
  return ({
    [DATA_STATE_KEY]: { [slice.name]: sliceState }
  } as unknown) as AppState;
};

const reducer = (sliceState: ReturnType<typeof slice.reducer> | undefined, action: AnyAction) => {
  return withAppState(slice.reducer(sliceState, action));
};

describe('settingsSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(withAppState(expected));
  });

  it('addFavorite(): adds an account uuid to favorites', () => {
    const uuid = 'uuid1' as TUuid;
    const actual = reducer(initialState, addFavorite(uuid));
    const expected = [uuid];
    expect(getFavorites(actual)).toEqual(expected);
  });

  it('addFavorites(): adds multiple account uuids to favorites', () => {
    const toAdd = ['uuid1', 'uuid2'] as TUuid[];
    const actual = reducer(initialState, addFavorites(toAdd));
    const expected = toAdd;
    expect(getFavorites(actual)).toEqual(expected);
  });

  it('resetFavoritesTo(): replaces favorites with new accounts', () => {
    const current = ['uuid1', 'uuid2'] as TUuid[];
    const toAdd = ['uuid3', 'uuid4'] as TUuid[];
    const actual = reducer(
      { ...initialState, dashboardAccounts: current },
      resetFavoritesTo(toAdd)
    );
    const expected = toAdd;
    expect(getFavorites(actual)).toEqual(expected);
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

  it('setRates(): sets rates', () => {
    const rates = fRates;
    const actual = reducer(initialState, setRates(rates));
    expect(getRates(actual)).toEqual(rates);
  });

  it('setInactivityTimer(): sets time', () => {
    const time = 2700000;
    const actual = reducer(initialState, setInactivityTimer(time));
    expect(getInactivityTimer(actual)).toEqual(time);
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
});
