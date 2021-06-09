import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from './root.reducer';

interface State {
  success: boolean;
  request: boolean;
  error?: string | Error;
}

export const initialState: State = {
  request: false,
  success: false
};

const importSlice = createSlice({
  name: 'import',
  initialState,
  reducers: {
    request(state) {
      state.request = true;
    },
    success(state) {
      state.request = false;
      state.success = true;
    },
    error(state, action: PayloadAction<State['error']>) {
      state.success = false;
      state.request = false;
      state.error = action.payload;
    },
    complete() {
      return initialState;
    }
  }
});
export const { complete: importComplete } = importSlice.actions;

export const selectImport = (state: AppState) => state[importSlice.name];
export const importSuccess = createSelector(selectImport, (slice) => slice.success);
export const importError = createSelector(selectImport, (slice) => slice.error);
export const importRequest = createSelector(selectImport, (slice) => slice.request);

export default importSlice;
