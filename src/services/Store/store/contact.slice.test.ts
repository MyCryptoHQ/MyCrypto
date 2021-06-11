import { mockAppState } from 'test-utils';

import { DEFAULT_NETWORK } from '@config';
import { fAccounts, fContacts } from '@fixtures';
import { ExtendedContact } from '@types';

import {
  initialState,
  selectAccountContact,
  selectContact,
  default as slice
} from './contact.slice';

const reducer = slice.reducer;
const { create, destroy, update, createOrUpdate, createOrUpdateMultiple } = slice.actions;

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

  it('createOrUpdate(): creates a new contact with uuid', () => {
    const entity = {
      label: 'test label',
      address: '0x0',
      network: DEFAULT_NETWORK
    };
    const actual = reducer([], createOrUpdate(entity));
    expect(actual[0]).toHaveProperty('uuid');
    expect(actual[0]).toMatchObject(entity);
  });

  it('createOrUpdate(): updates an existing entity', () => {
    const expected = { ...fContacts[0], label: 'updated_label' };
    const state = reducer(fContacts, createOrUpdate(expected));
    const actual = selectContact(expected.uuid)(mockAppState({ [slice.name]: state }));
    expect(actual).toEqual(expected);
  });

  it('createOrUpdate(): returns a list of unique contacts by uuid', () => {
    const expected = { ...fContacts[0], label: 'updated_label' };
    const state = reducer(fContacts, createOrUpdate(expected));
    const actual = state.filter((c) => c.uuid === expected.uuid);
    expect(actual).toHaveLength(1);
  });

  it('createOrUpdateMultiple(): returns a list of unique contacts by uuid', () => {
    const input = [
      { ...fContacts[0], label: 'updated_label' },
      { ...fContacts[1], label: 'updated_label2' }
    ];
    const actual = reducer(fContacts, createOrUpdateMultiple(input));
    const expected = [...input, fContacts[2]];
    expect(actual).toStrictEqual(expected);
  });

  it('selectAccountContact(): Selects a contact based on an account', () => {
    const state = mockAppState({
      addressBook: fContacts
    });

    const actual = selectAccountContact(fAccounts[0])(state);

    expect(actual).toEqual(fContacts[1]);
  });
});
