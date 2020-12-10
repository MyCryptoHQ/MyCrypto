import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from './reducer';

interface State {
  success: boolean;
  error?: string;
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
    error(state, action: PayloadAction<string>) {
      state.error = action.payload;
    }
  }
});

export const importSuccess = (state: AppState) => state[importSlice.name].success;
export const importError = (state: AppState) => state[importSlice.name].success;

export default importSlice;
