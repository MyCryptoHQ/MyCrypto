import { DEFAULT_NETWORK } from '@config';
import { ExtendedContact } from '@types';

import { initialState, default as slice } from './contact.slice';

const reducer = slice.reducer;
const { create, destroy, update } = slice.actions;

describe('ContactSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('create(): adds an entity by uuid', () => {
    const entity = { uuid: 'random' } as ExtendedContact;
    const actual = reducer([], create(entity));
    const expected = [entity];
    expect(actual).toEqual(expected);
  });

  it('destroy(): deletes an entity by uuid', () => {
    const a1 = { uuid: 'todestroy' } as ExtendedContact;
    const a2 = { uuid: 'tokeep' } as ExtendedContact;
    const state = [a1, a2];
    const actual = reducer(state, destroy(a1.uuid));
    const expected = [a2];
    expect(actual).toEqual(expected);
  });

  it('update(): updates an entity', () => {
    const entity = {
      uuid: 'random',
      label: 'test label',
      address: '0x0',
      network: DEFAULT_NETWORK
    } as ExtendedContact;
    const state = [entity];
    const modifiedEntity = { ...entity, address: '0x1' } as ExtendedContact;
    const actual = reducer(state, update(modifiedEntity));
    const expected = [modifiedEntity];
    expect(actual).toEqual(expected);
  });
});
