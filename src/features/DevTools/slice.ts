import { createAction, createReducer } from '@reduxjs/toolkit';
import { call, takeEvery } from 'redux-saga/effects';

import { path } from '@vendor';

const sliceName = 'demo';
const initialState = {
  greeting: 'Hello from Reducer',
  count: 0
};

/* Selectors */
export const getGreeting = path([sliceName, 'greeting']);
export const getCount = path([sliceName, 'count']);

/* Actions */
export const increment = createAction<number | undefined>(`${sliceName}/increment`);
export const reset = createAction<undefined>(`${sliceName}/reset`);

/* Sagas */
/** Saga - worker */
function* onIncrement() {
  yield call(console.log, 'Hello from Saga!');
}
/** Saga - watcher */
export function* watchIncrement() {
  yield takeEvery(increment.type, onIncrement);
}

/* Reducer */
// 1. Toolkit sets .toString() to return the action type
// 2. With the embeded Immer we can either modify the drat || return a new value
const demoReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(increment, (s) => {
      s.count = s.count + 1;
    })
    .addCase(reset, () => initialState)
);

export default demoReducer;
