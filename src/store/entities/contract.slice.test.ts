import { ExtendedContract } from '@types';

import { initialState, default as slice } from './contract.slice';

const reducer = slice.reducer;
const { create, destroy } = slice.actions;

describe('AccountSlice', () => {
  it('create(): adds an entity by uuid', () => {
    const entity = { uuid: 'random' } as ExtendedContract;
    const actual = reducer(initialState, create(entity));
    const expected = { [entity.uuid]: entity };
    expect(actual).toEqual(expected);
  });

  it('destroy(): deletes an entity by uuid', () => {
    const entity = { uuid: 'todestroy' } as ExtendedContract;
    const state = { [entity.uuid]: entity };
    const actual = reducer(state, destroy(entity.uuid));
    const expected = {};
    expect(actual).toEqual(expected);
  });
});
