import { ACTION_STATE, ExtendedUserAction } from '@types';
import { generateUUID } from '@utils';

import { initialState, default as slice } from './userAction.slice';

const reducer = slice.reducer;
const { create, destroy, update, updateStateByName } = slice.actions;

describe('UserActionSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('create(): adds an entity by uuid', () => {
    const entity = { uuid: 'random' } as ExtendedUserAction;
    const actual = reducer([], create(entity));
    const expected = [entity];
    expect(actual).toEqual(expected);
  });

  it('destroy(): deletes an entity by uuid', () => {
    const a1 = { uuid: 'todestroy' } as ExtendedUserAction;
    const a2 = { uuid: 'tokeep' } as ExtendedUserAction;
    const state = [a1, a2];
    const actual = reducer(state, destroy(a1.uuid));
    const expected = [a2];
    expect(actual).toEqual(expected);
  });

  it('update(): updates an entity', () => {
    const entity = {
      name: 'random user action',
      state: ACTION_STATE.STARTED,
      uuid: generateUUID()
    } as ExtendedUserAction;
    const state = [entity];
    const modifiedEntity = { ...entity, state: ACTION_STATE.COMPLETED } as ExtendedUserAction;
    const actual = reducer(state, update(modifiedEntity));
    const expected = [modifiedEntity];
    expect(actual).toEqual(expected);
  });

  it('updateStateByName(): updates an entities state provided a name', () => {
    const entity = {
      name: 'update_me',
      state: ACTION_STATE.STARTED,
      uuid: generateUUID()
    } as ExtendedUserAction;
    const state = [entity];
    const modifiedEntity = { ...entity, state: ACTION_STATE.COMPLETED } as ExtendedUserAction;
    const actual = reducer(state, updateStateByName(modifiedEntity));
    const expected = [modifiedEntity];
    expect(actual).toEqual(expected);
  });
});
