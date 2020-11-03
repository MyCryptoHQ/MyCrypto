import { ExtendedContact } from '@types';

import { initialState, default as slice } from './contact.slice';

const reducer = slice.reducer;
const { create, destroy, update, updateMany, reset } = slice.actions;

describe('ContactSlice', () => {
  it('create(): adds an entity by uuid', () => {
    const entity = { uuid: 'random' } as ExtendedContact;
    const actual = reducer(initialState, create(entity));
    const expected = { [entity.uuid]: entity };
    expect(actual).toEqual(expected);
  });

  it('destroy(): deletes an entity by uuid', () => {
    const entity = { uuid: 'todestroy' } as ExtendedContact;
    const state = { [entity.uuid]: entity };
    const actual = reducer(state, destroy(entity.uuid));
    const expected = {};
    expect(actual).toEqual(expected);
  });

  it('update(): updates an entity', () => {
    const entity = { uuid: 'random', label: 'John' } as ExtendedContact;
    const state = { [entity.uuid]: entity };
    const modifiedEntity = { ...entity, address: '0x1' } as ExtendedContact;
    const actual = reducer(state, update(modifiedEntity));
    const expected = { [entity.uuid]: modifiedEntity };
    expect(actual).toEqual(expected);
  });

  it('updateMany(): batch update entities', () => {
    const entities = [
      { uuid: 'first', label: 'John' },
      { uuid: 'second', label: 'Mary' },
      { uuid: 'third', label: 'Jane' }
    ] as ExtendedContact[];
    const state = entities.reduce((acc, entity) => ({ ...acc, [entity.uuid]: entity }), {});
    const modifiedEntities = [
      { uuid: 'second', label: 'Peter' },
      { uuid: 'third', label: 'Georges' }
    ] as ExtendedContact[];
    const actual = reducer(state, updateMany(modifiedEntities));
    const expected = {
      first: { uuid: 'first', label: 'John' },
      second: { uuid: 'second', label: 'Peter' },
      third: { uuid: 'third', label: 'Georges' }
    };
    expect(actual).toEqual(expected);
  });

  it('reset(): can reset', () => {
    const entity = { uuid: 'random', label: 'Peter' } as ExtendedContact;
    const state = { [entity.uuid]: entity };
    const actual = reducer(state, reset());
    expect(actual).toEqual(initialState);
  });
});
