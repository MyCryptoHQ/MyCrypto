import { IAccount } from '@types';

import { initialState, default as slice } from './account.slice';

const reducer = slice.reducer;
const { create, destroy, update, reset } = slice.actions;

describe('AccountSlice', () => {
  it('create(): adds an entity by uuid', () => {
    const entity = { uuid: 'random' } as IAccount;
    const actual = reducer(initialState, create(entity));
    const expected = { [entity.uuid]: entity };
    expect(actual).toEqual(expected);
  });

  it('destroy(): deletes an entity by uuid', () => {
    const entity = { uuid: 'todestroy' } as IAccount;
    const state = { [entity.uuid]: entity };
    const actual = reducer(state, destroy(entity.uuid));
    const expected = {};
    expect(actual).toEqual(expected);
  });

  it('update(): updates an entity', () => {
    const entity = { uuid: 'random', address: '0x0' } as IAccount;
    const state = { [entity.uuid]: entity };
    const modifiedEntity = { ...entity, address: '0x1' } as IAccount;
    const actual = reducer(state, update(modifiedEntity));
    const expected = { [entity.uuid]: modifiedEntity };
    expect(actual).toEqual(expected);
  });

  it('reset(): can reset', () => {
    const entity = { uuid: 'random', address: '0x0' } as IAccount;
    const state = { [entity.uuid]: entity };
    const actual = reducer(state, reset());
    expect(actual).toEqual(initialState);
  });
});
