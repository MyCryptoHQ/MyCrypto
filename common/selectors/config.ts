import {
  NetworkConfig,
  NetworkContract,
  NETWORKS,
  NodeConfig,
  NODES
} from 'config/data';
import { INode } from 'libs/nodes/INode';
import { AppState } from 'reducers';

export function getNode(state: AppState): string {
  return state.config.nodeSelection;
}

export function getNodeConfig(state: AppState): NodeConfig {
  return NODES[state.config.nodeSelection];
}

export function getNodeLib(state: AppState): INode {
  return NODES[state.config.nodeSelection].lib;
}

export function getNetworkConfig(state: AppState): NetworkConfig {
  return NETWORKS[NODES[state.config.nodeSelection].network];
}

export function getNetworkContracts(state: AppState): NetworkContract[] | null {
  return getNetworkConfig(state).contracts;
}

export function getGasPriceGwei(state: AppState): number {
  return state.config.gasPriceGwei;
}

export function getLanguageSelection(state: AppState): string {
  return state.config.languageSelection;
}
