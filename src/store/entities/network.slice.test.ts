import { NETWORKS } from '@database';
import { Network } from '@types';

import { initialState, default as slice } from './network.slice';

const reducer = slice.reducer;
const { create, update } = slice.actions;

describe('NetworkSlice', () => {
  it('create(): adds an entity by id', () => {
    const entity = { id: 'Ropsten' } as Network;
    const actual = reducer(initialState, create(entity));
    const expected = { [entity.id]: entity };
    expect(actual).toEqual(expected);
  });

  it('update(): updates an entity', () => {
    const entity = { id: 'Ethereum', isCustom: false } as Network;
    const state = { [entity.id]: entity } as typeof NETWORKS;
    const modifiedEntity = { ...entity, address: '0x1' } as Network;
    const actual = reducer(state, update(modifiedEntity));
    const expected = { [entity.id]: modifiedEntity };
    expect(actual).toEqual(expected);
  });
});
