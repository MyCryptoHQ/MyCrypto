import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { NETWORKS } from '@database';
import { LSKeys, Network } from '@types';

export const initialState = NETWORKS;

const slice = createSlice({
  name: LSKeys.NETWORKS,
  initialState,
  reducers: {
    create(state, action: PayloadAction<Network>) {
      const { id: uuid } = action.payload;
      state[uuid] = action.payload;
    },

    update(state, action: PayloadAction<Network>) {
      const { id: uuid } = action.payload;
      state[uuid] = action.payload;
    },
    updateMany(state, action: PayloadAction<Network[]>) {
      action.payload.forEach((network) => {
        state[network.id] = network;
      });
    }
  }
});

export default slice;
