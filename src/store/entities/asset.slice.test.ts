import { ExtendedAsset } from '@types';

import { initialState, default as slice } from './asset.slice';

const reducer = slice.reducer;
const { create, destroy, update, updateMany, reset } = slice.actions;

describe('AccountSlice', () => {
  it('create(): adds an entity by uuid', () => {
    const entity = { uuid: 'random' } as ExtendedAsset;
    const actual = reducer(initialState, create(entity));
    const expected = { [entity.uuid]: entity };
    expect(actual).toEqual(expected);
  });

  it('destroy(): deletes an entity by uuid', () => {
    const entity = { uuid: 'todestroy' } as ExtendedAsset;
    const state = { [entity.uuid]: entity };
    const actual = reducer(state, destroy(entity.uuid));
    const expected = {};
    expect(actual).toEqual(expected);
  });

  it('update(): updates an entity', () => {
    const entity = { uuid: 'random', contractAddress: '0x0' } as ExtendedAsset;
    const state = { [entity.uuid]: entity };
    const modifiedEntity = { ...entity, address: '0x1' } as ExtendedAsset;
    const actual = reducer(state, update(modifiedEntity));
    const expected = { [entity.uuid]: modifiedEntity };
    expect(actual).toEqual(expected);
  });

  it('updateMany(): batch update entities', () => {
    const entities = [
      { uuid: 'first', contractAddress: '0x0' },
      { uuid: 'second', contractAddress: '0x0' },
      { uuid: 'third', contractAddress: '0x0' }
    ] as ExtendedAsset[];
    const state = entities.reduce((acc, entity) => ({ ...acc, [entity.uuid]: entity }), {});
    const modifiedEntities = [
      { uuid: 'second', contractAddress: '0x2' },
      { uuid: 'third', contractAddress: '0x3' }
    ] as ExtendedAsset[];
    const actual = reducer(state, updateMany(modifiedEntities));
    const expected = {
      first: { uuid: 'first', contractAddress: '0x0' },
      second: { uuid: 'second', contractAddress: '0x2' },
      third: { uuid: 'third', contractAddress: '0x3' }
    };
    expect(actual).toEqual(expected);
  });

  it('reset(): can reset', () => {
    const entity = { uuid: 'random', contractAddress: '0x0' } as ExtendedAsset;
    const state = { [entity.uuid]: entity };
    const actual = reducer(state, reset());
    expect(actual).toEqual(initialState);
  });
});
