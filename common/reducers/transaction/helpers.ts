import { Action, ReducersMapObject } from 'redux';
export { createReducerFromObj };

const createReducerFromObj = <S>(obj: ReducersMapObject, initialState: S) => (
  state = initialState,
  action: Action
): S => (obj[action.type] ? obj[action.type](state, action) : state);
