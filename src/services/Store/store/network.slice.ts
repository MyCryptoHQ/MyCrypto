import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { DEFAULT_NETWORK } from '@config';
import { EthersJS } from '@services/EthService/network/ethersJsProvider';
import { LSKeys, Network, NetworkId } from '@types';
import { findIndex, propEq } from '@vendor';

import { initialLegacyState } from './legacy.initialState';
import { getAppState } from './selectors';

const sliceName = LSKeys.NETWORKS;
export const initialState = initialLegacyState[sliceName];

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    create(state, action: PayloadAction<Network>) {
      state.push(action.payload);
    },
    createMany(state, action: PayloadAction<Network[]>) {
      action.payload.forEach((a) => {
        state.push(a);
      });
    },
    destroy(state, action: PayloadAction<NetworkId>) {
      const idx = findIndex(propEq('id', action.payload), state);
      state.splice(idx, 1);
    },
    update(state, action: PayloadAction<Network>) {
      const idx = findIndex(propEq('id', action.payload.id), state);
      state[idx] = action.payload;
    },
    updateMany(state, action: PayloadAction<Network[]>) {
      const network = action.payload;
      network.forEach((network) => {
        const idx = findIndex(propEq('id', network.id), state);
        state[idx] = network;
      });
    },
    deleteNode(state, action: PayloadAction<{ network: NetworkId; nodeName: string }>) {
      const { network: networkId, nodeName } = action.payload;
      const idx = findIndex(propEq('id', networkId), state);

      const network = state[idx];

      const { nodes } = network;

      const newNodes = [...nodes.filter((n) => n.name !== nodeName)];

      const newSelectedNode = (() => {
        if (network.selectedNode === nodeName) {
          return newNodes[0]?.name;
        }
        return network.selectedNode;
      })();

      state[idx] = {
        ...network,
        nodes: newNodes,
        selectedNode: newSelectedNode
      };
    },
    reset() {
      return initialState;
    }
  }
});

export const deleteNodeOrNetwork = createAction<{ network: NetworkId; nodeName: string }>(
  `${slice.name}/deleteNodeOrNetwork`
);

export const {
  create: createNetwork,
  createMany: createNetworks,
  destroy: destroyNetwork,
  update: updateNetwork,
  updateMany: updateNetworks,
  reset: resetNetwork,
  deleteNode
} = slice.actions;

export default slice;

/**
 * Selectors
 */

const findNetwork = (id: NetworkId) => (networks: Network[]) => networks.find((n) => n.id === id)!;

export const selectNetworks = createSelector([getAppState], (s) => s[slice.name]);

export const getNetwork = (networkId: NetworkId) =>
  createSelector(selectNetworks, findNetwork(networkId));

// Create alias in anticipation of renaming
// @todo: Remove original in favor of alias.
export const selectNetwork = getNetwork;
export const selectDefaultNetwork = selectNetwork(DEFAULT_NETWORK);

export const canDeleteNode = (networkId: NetworkId) =>
  createSelector([getAppState], (state) => {
    const network = state.networks.find((n) => n.id === networkId)!;

    if (network.isCustom && network.nodes.length === 1) {
      return (
        !state.accounts.some((a) => a.networkId === networkId) &&
        !state.addressBook.some((c) => c.network === networkId) &&
        !state.contracts.some((c) => c.networkId === networkId)
      );
    }
    return true;
  });

/**
 * Sagas
 */
export function* networkSaga() {
  yield all([
    takeLatest(deleteNode.type, deleteNodeWorker),
    takeLatest(deleteNodeOrNetwork.type, deleteNodeOrNetworkWorker)
  ]);
}

export function* deleteNodeWorker({
  payload
}: PayloadAction<{ network: NetworkId; nodeName: string }>) {
  const { network: networkId } = payload;

  const network: Network = yield select(getNetwork(networkId));

  yield call(EthersJS.updateEthersInstance, network);
}

export function* deleteNodeOrNetworkWorker({
  payload
}: PayloadAction<{ network: NetworkId; nodeName: string }>) {
  const { network: networkId, nodeName } = payload;
  const network: Network = yield select(getNetwork(networkId));

  if (network.isCustom && network.nodes.length === 1) {
    yield put(slice.actions.destroy(networkId));
  } else {
    yield put(deleteNode({ nodeName, network: networkId }));
  }
}
