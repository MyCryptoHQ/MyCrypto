import { Network } from '@types';
import { isEmpty } from '@vendor';

import { initialState, default as slice } from './network.slice';

const reducer = slice.reducer;
const { create, createMany, destroy, update, updateMany, reset } = slice.actions;

describe('NetworkSlice', () => {
  it('has an initialState', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(isEmpty(expected)).toBeFalsy();
    expect(actual).toEqual(expected);
  });

  it('create(): adds an entity by id', () => {
    const entity = { id: 'Ethereum' } as Network;
    const actual = reducer([], create(entity));
    const expected = [entity];
    expect(actual).toEqual(expected);
  });

  it('createMany(): adds multiple entities by id', () => {
    const a1 = { id: 'Ropsten' } as Network;
    const a2 = { id: 'Kovan' } as Network;
    const a3 = { id: 'Rinkeby' } as Network;
    const actual = reducer([a1], createMany([a2, a3]));
    const expected = [a1, a2, a3];
    expect(actual).toEqual(expected);
  });

  it('destroy(): deletes an entity by id', () => {
    const a1 = { id: 'Ropsten' } as Network;
    const a2 = { id: 'Rinkeby' } as Network;
    const state = [a1, a2];
    const actual = reducer(state, destroy(a1.id));
    const expected = [a2];
    expect(actual).toEqual(expected);
  });

  it('update(): updates an entity', () => {
    const entity = { id: 'Ropsten', name: 'ropsteen' } as Network;
    const state = [entity];
    const modifiedEntity = { ...entity, name: 'ropsten' } as Network;
    const actual = reducer(state, update(modifiedEntity));
    const expected = [modifiedEntity];
    expect(actual).toEqual(expected);
  });

  it('updateMany(): updates mulitple entities', () => {
    const a1 = { id: 'Rinkeby', name: 'rinkeby' } as Network;
    const a2 = { id: 'Ropsten', name: 'ropsten' } as Network;
    const a3 = { id: 'Goerli', name: 'goerli' } as Network;
    const state = [a1, a2, a3];
    const modifiedEntities = [
      { ...a1, name: 'Rink' } as Network,
      { ...a2, name: 'Rops' } as Network
    ];
    const actual = reducer(state, updateMany(modifiedEntities));
    const expected = [...modifiedEntities, a3];
    expect(actual).toEqual(expected);
  });

  it('reset(): can reset', () => {
    const entity = { id: 'Rinkeby', name: 'Rink' } as Network;
    const state = [entity];
    const actual = reducer(state, reset());
    expect(actual).toEqual(initialState);
  });
});
