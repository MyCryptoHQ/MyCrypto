// @flow
import type { State } from 'reducers';
import type { INode } from 'libs/nodes/INode';
import { NODES, NETWORKS } from 'config/data';
import type { NodeConfig, NetworkConfig, NetworkContract } from 'config/data';

export function getNode(state: State): string {
  return state.config.nodeSelection;
}

export function getNodeConfig(state: State): NodeConfig {
  return NODES[state.config.nodeSelection];
}

export function getNodeLib(state: State): INode {
  return NODES[state.config.nodeSelection].lib;
}

export function getNetworkConfig(state: State): NetworkConfig {
  return NETWORKS[NODES[state.config.nodeSelection].network];
}

export function getNetworkContracts(state: State): ?Array<NetworkContract> {
  return getNetworkConfig(state).contracts;
}

export function getGasPriceGwei(state: State): number {
  return state.config.gasPriceGwei;
}

export function getLanguageSelection(state: State): string {
  return state.config.languageSelection;
}
