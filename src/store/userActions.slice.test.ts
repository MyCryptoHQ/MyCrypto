import { ExtendedUserAction } from '@types';

import {
  createUserAction,
  destroyUserAction,
  initialState,
  default as reducer,
  updateUserAction
} from './userActions.slice';

describe('ContractSlice', () => {
  it('createUserAction(): adds an entity by uuid', () => {
    const userAction = { uuid: 'random' } as ExtendedUserAction;
    const actual = reducer(initialState, createUserAction(userAction));
    const expected = { [userAction.uuid]: userAction };
    expect(actual).toEqual(expected);
  });

  it('destroyUserAction(): deletes an entity by uuid', () => {
    const userAction = { uuid: 'random' } as ExtendedUserAction;
    const state = { [userAction.uuid]: userAction };
    const actual = reducer(state, destroyUserAction(userAction.uuid));
    const expected = {};
    expect(actual).toEqual(expected);
  });

  it('updateUserAction(): updates an entity', () => {
    const entity = { uuid: 'random', name: 'myc_membership' } as ExtendedUserAction;
    const state = { [entity.uuid]: entity };
    const modifiedEntity = { ...entity, name: 'feedback' } as ExtendedUserAction;
    const actual = reducer(state, updateUserAction(modifiedEntity));
    const expected = { [entity.uuid]: modifiedEntity };
    expect(actual).toEqual(expected);
  });
});
