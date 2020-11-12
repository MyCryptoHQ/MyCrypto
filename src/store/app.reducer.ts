import { createAction, createReducer } from '@reduxjs/toolkit';

import { LSKeys } from '@types';

// Action to trigger saga watcher
export const importState = createAction<string>('import/request');
importState.type = importState.toString();

export const importSuccess = createAction('import/success');
export const importFailure = createAction('import/failure');
export const setPassword = createAction<string>('state/password');

const initialState = {} as {
  importSuccess?: boolean;
  importError?: boolean;
  [LSKeys.PASSWORD]?: string;
};

const appReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(importSuccess, (s) => {
      s.importSuccess = true;
    })
    .addCase(importFailure, (s) => {
      s.importError = true;
    })
    .addCase(setPassword, (s, a) => {
      s.password = a.payload;
    })
);

export default appReducer;
