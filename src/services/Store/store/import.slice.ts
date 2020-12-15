import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from './root.reducer';

interface State {
  success: boolean;
  error?: string | Error;
}

const initialState: State = {
  success: false
};

const importSlice = createSlice({
  name: 'import',
  initialState,
  reducers: {
    success(state) {
      state.success = true;
    },
    error(state, action: PayloadAction<State['error']>) {
      state.error = action.payload;
    }
  }
});

export const importSuccess = (state: AppState) => state[importSlice.name].success;
export const importError = (state: AppState) => state[importSlice.name].error;

export default importSlice;
