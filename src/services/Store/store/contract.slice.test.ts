import { mockAppState } from 'test-utils';

import { fContracts } from '@fixtures';
import { ExtendedContract } from '@types';

import {
  createContract,
  destroyContract,
  initialState,
  selectContracts,
  default as slice
} from './contract.slice';

const reducer = slice.reducer;

describe('ContractSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('createContract(): adds an entity by uuid', () => {
    const entity = fContracts[0] as ExtendedContract;
    const actual = reducer([], createContract(entity));
    const expected = [entity];
    expect(actual).toEqual(expected);
  });

  it('destroyContract(): deletes an entity by uuid', () => {
    const a1 = { uuid: 'todestroy' } as ExtendedContract;
    const a2 = { uuid: 'tokeep' } as ExtendedContract;
    const state = [a1, a2];
    const actual = reducer(state, destroyContract(a1.uuid));
    const expected = [a2];
    expect(actual).toEqual(expected);
  });

  it('selectContracts(): selects the correct slice', () => {
    const actual = selectContracts(mockAppState());
    const expected = initialState;
    expect(actual).toEqual(expected);
  });
});
