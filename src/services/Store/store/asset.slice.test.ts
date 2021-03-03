import { call } from 'redux-saga-test-plan/matchers';
import { expectSaga, mockAppState } from 'test-utils';

import { fAssets } from '@fixtures';
import { MyCryptoApiService } from '@services';
import { ExtendedAsset } from '@types';
import { arrayToObj } from '@utils';

import {
  addAssetsFromAPI,
  fetchAssetsWorker,
  getAssetByUUID,
  initialState,
  default as slice
} from './asset.slice';

const reducer = slice.reducer;
const { create, createMany, destroy, update, updateMany, reset } = slice.actions;

describe('AccountSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('create(): adds an entity by uuid', () => {
    const entity = { uuid: 'random' } as ExtendedAsset;
    const actual = reducer([], create(entity));
    const expected = [entity];
    expect(actual).toEqual(expected);
  });

  it('createMany(): adds multiple entities by uuid', () => {
    const a1 = { uuid: 'first' } as ExtendedAsset;
    const a2 = { uuid: 'second' } as ExtendedAsset;
    const a3 = { uuid: 'third' } as ExtendedAsset;
    const actual = reducer([a1], createMany([a2, a3]));
    const expected = [a1, a2, a3];
    expect(actual).toEqual(expected);
  });

  it('destroy(): deletes an entity by uuid', () => {
    const a1 = { uuid: 'todestroy' } as ExtendedAsset;
    const a2 = { uuid: 'tokeep' } as ExtendedAsset;
    const state = [a1, a2];
    const actual = reducer(state, destroy(a1.uuid));
    const expected = [a2];
    expect(actual).toEqual(expected);
  });

  it('update(): updates an entity', () => {
    const entity = { uuid: 'random', contractAddress: '0x0' } as ExtendedAsset;
    const state = [entity];
    const modifiedEntity = { ...entity, address: '0x1' } as ExtendedAsset;
    const actual = reducer(state, update(modifiedEntity));
    const expected = [modifiedEntity];
    expect(actual).toEqual(expected);
  });

  it('updateMany(): updates mulitple entities', () => {
    const a1 = { uuid: 'random', contractAddress: '0x0' } as ExtendedAsset;
    const a2 = { uuid: 'random1', contractAddress: '0x1' } as ExtendedAsset;
    const a3 = { uuid: 'random2', contractAddress: '0x2' } as ExtendedAsset;
    const state = [a1, a2, a3];
    const modifiedEntities = [
      { ...a1, address: '0xchanged' } as ExtendedAsset,
      { ...a2, address: '0xchanged1' } as ExtendedAsset
    ];
    const actual = reducer(state, updateMany(modifiedEntities));
    const expected = [...modifiedEntities, a3];
    expect(actual).toEqual(expected);
  });

  it('reset(): can reset', () => {
    const entity = { uuid: 'random', contractAddress: '0x0' } as ExtendedAsset;
    const state = [entity];
    const actual = reducer(state, reset());
    expect(actual).toEqual(initialState);
  });

  it('getAssetByUUID(): return an asset by its uuid', () => {
    const asset = fAssets[0];
    const state = mockAppState({ [slice.name]: fAssets });
    expect(getAssetByUUID(asset.uuid)(state)).toEqual(asset);
  });
});

describe('fetchAssetsWorker()', () => {
  it('calls getAssets and puts result', () => {
    const assets = arrayToObj('uuid')(fAssets);
    return expectSaga(fetchAssetsWorker)
      .provide([[call.fn(MyCryptoApiService.instance.getAssets), assets]])
      .call(MyCryptoApiService.instance.getAssets)
      .put(addAssetsFromAPI(assets))
      .silentRun();
  });
});
