import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export const initialState = {
  mtime: '',
  data: ''
};

const slice = createSlice({
  name: 'vault',
  initialState,
  reducers: {
    set(_, action: PayloadAction<typeof initialState | undefined>) {
      return action.payload;
    }
  }
});

export const { set: setVault } = slice.actions;
export const destroyVault = () => setVault();

export default persistReducer(
  {
    key: 'Vault',
    keyPrefix: 'MYC:',
    storage
  },
  slice.reducer
);
