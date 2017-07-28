// @flow
import type { State } from 'reducers';
import { BaseNode } from 'libs/nodes';
import { NODES, NETWORKS } from 'config/data';
import type { NetworkConfig, NetworkContract } from 'config/data';

export function getNode(state: State): string {
  return state.config.nodeSelection;
}

export function getNodeLib(state: State): BaseNode {
  return NODES[state.config.nodeSelection].lib;
}

export function getNetworkConfig(state: State): NetworkConfig {
  return NETWORKS[NODES[state.config.nodeSelection].network];
}

export function getNetworkContracts(state: State): ?Array<NetworkContract> {
  return getNetworkConfig(state).contracts;
}
