import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { NETWORKS } from '@database/data';
import { LSKeys, Network, NetworkId, NodeOptions } from '@types';
import { find, map, propEq, reject, when } from '@vendor';

export const initialState = NETWORKS;

export const getNetwork = (networkId: NetworkId) => (state: typeof initialState) =>
  state[networkId];
export const getNodes = (networkId: NetworkId) =>
  createSelector(getNetwork(networkId), (network) => network.nodes);
export const getNode = (networkId: NetworkId, nodeId: string) =>
  createSelector(getNodes(networkId), (nodes) => find(propEq('name', nodeId), nodes));

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
    },
    addNode(state, action: PayloadAction<{ node: NodeOptions; networkId: NetworkId }>) {
      const { node, networkId } = action.payload;
      // @todo: Redux - update selectedNode as well ?
      state[networkId].nodes.push(node);
    },
    updateNode(
      state,
      action: PayloadAction<{ node: NodeOptions; nodeId: string; networkId: NetworkId }>
    ) {
      const { node, nodeId, networkId } = action.payload;
      // @todo: Redux - update selectedNode as well ?
      state[networkId].nodes = map(
        when(propEq('name', nodeId), () => node),
        state[networkId].nodes
      );
    },
    deleteNode(state, action: PayloadAction<{ nodeId: string; networkId: NetworkId }>) {
      const { nodeId, networkId } = action.payload;
      // @todo: Redux - update selectedNode as well ?
      state[networkId].nodes = reject<NodeOptions>(propEq('name', nodeId), state[networkId].nodes);
    }
  }
});

export default slice;
