import { IAccount } from '@types';

import { initialState, default as slice } from './account.slice';

const reducer = slice.reducer;
const { create, destroy, update, updateMany, reset } = slice.actions;

describe('AccountSlice', () => {
  it('create(): adds an entity by uuid', () => {
    const entity = { uuid: 'random' } as IAccount;
    const actual = reducer(initialState, create(entity));
    const expected = [entity];
    expect(actual).toEqual(expected);
  });

  it('destroy(): deletes an entity by uuid', () => {
    const a1 = { uuid: 'todestroy' } as IAccount;
    const a2 = { uuid: 'tokeep' } as IAccount;
    const state = [a1, a2];
    const actual = reducer(state, destroy(a1.uuid));
    const expected = [a2];
    expect(actual).toEqual(expected);
  });

  it('update(): updates an entity', () => {
    const entity = { uuid: 'random', address: '0x0' } as IAccount;
    const state = [entity];
    const modifiedEntity = { ...entity, address: '0x1' } as IAccount;
    const actual = reducer(state, update(modifiedEntity));
    const expected = [modifiedEntity];
    expect(actual).toEqual(expected);
  });

  it('updateMany(): updates mulitple entities', () => {
    const a1 = { uuid: 'random', address: '0x0' } as IAccount;
    const a2 = { uuid: 'random1', address: '0x1' } as IAccount;
    const a3 = { uuid: 'random2', address: '0x2' } as IAccount;
    const state = [a1, a2, a3];
    const modifiedEntities = [
      { ...a1, address: '0xchanged' } as IAccount,
      { ...a2, address: '0xchanged1' } as IAccount
    ];
    const actual = reducer(state, updateMany(modifiedEntities));
    const expected = [...modifiedEntities, a3];
    expect(actual).toEqual(expected);
  });

  it('reset(): can reset', () => {
    const entity = { uuid: 'random', address: '0x0' } as IAccount;
    const state = [entity];
    const actual = reducer(state, reset());
    expect(actual).toEqual(initialState);
  });
});
