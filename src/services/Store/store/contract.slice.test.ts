import { fContracts } from '@fixtures';
import { ExtendedContract } from '@types';

import { initialState, default as slice } from './contract.slice';

const reducer = slice.reducer;
const { create, destroy } = slice.actions;

describe('ContractSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('create(): adds an entity by uuid', () => {
    const entity = fContracts[0] as ExtendedContract;
    const actual = reducer([], create(entity));
    const expected = [entity];
    expect(actual).toEqual(expected);
  });

  it('destroy(): deletes an entity by uuid', () => {
    const a1 = { uuid: 'todestroy' } as ExtendedContract;
    const a2 = { uuid: 'tokeep' } as ExtendedContract;
    const state = [a1, a2];
    const actual = reducer(state, destroy(a1.uuid));
    const expected = [a2];
    expect(actual).toEqual(expected);
  });
});
