import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { DEFAULT_NETWORK } from '@config';
import { EthersJS } from '@services/EthService/network/ethersJsProvider';
import { LSKeys, Network, NetworkId } from '@types';
import { find, findIndex, propEq } from '@vendor';

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
    reset() {
      return initialState;
    }
  }
});

export const deleteNode = createAction<{ network: NetworkId; nodeName: string }>(
  `${slice.name}/deleteNode`
);

export const deleteNodeOrNetwork = createAction<{ network: NetworkId; nodeName: string }>(
  `${slice.name}/deleteNodeOrNetwork`
);

export const {
  create: createNetwork,
  createMany: createNetworks,
  destroy: destroyNetwork,
  update: updateNetwork,
  updateMany: updateNetworks,
  reset: resetNetwork
} = slice.actions;

export default slice;

/**
 * Selectors
 */

export const getNetworks = createSelector([getAppState], (s) => s[slice.name]);
export const getDefaultNetwork = createSelector(getNetworks, find(propEq('id', DEFAULT_NETWORK)));

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
  const { network: networkId, nodeName } = payload;
  const networks: Network[] = yield select(getNetworks);

  const network = networks.find((n) => n.id === networkId)!;

  const { nodes } = network;

  const newNodes = [...nodes.filter((n) => n.name !== nodeName)];

  const newSelectedNode = (() => {
    if (
      network.selectedNode === nodeName &&
      (network.selectedNode === network.autoNode || network.autoNode === undefined)
    ) {
      return newNodes[0]?.name;
    } else if (network.selectedNode === nodeName) {
      return network.autoNode;
    }
    return network.selectedNode;
  })();

  const networkUpdate = {
    ...network,
    nodes: newNodes,
    selectedNode: newSelectedNode
  };

  yield put(slice.actions.update(networkUpdate));
  yield call(EthersJS.updateEthersInstance, networkUpdate);
}

export function* deleteNodeOrNetworkWorker({
  payload
}: PayloadAction<{ network: NetworkId; nodeName: string }>) {
  const { network: networkId, nodeName } = payload;
  const networks: Network[] = yield select(getNetworks);

  const network = networks.find((n) => n.id === networkId)!;

  if (network.isCustom && network.nodes.length === 1) {
    yield put(slice.actions.destroy(networkId));
  } else {
    yield put(deleteNode({ nodeName, network: networkId }));
  }
}
