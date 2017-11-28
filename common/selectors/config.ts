import {
  NetworkConfig,
  NetworkContract,
  NETWORKS,
  NodeConfig,
  CustomNodeConfig
} from 'config/data';
import { INode } from 'libs/nodes/INode';
import { AppState } from 'reducers';

export function getNode(state: AppState): string {
  return state.config.nodeSelection;
}

export function getNodeConfig(state: AppState): NodeConfig {
  return state.config.node;
}

export function getNodeLib(state: AppState): INode {
  return getNodeConfig(state).lib;
}

export function getNetworkConfig(state: AppState): NetworkConfig {
  return NETWORKS[getNodeConfig(state).network];
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

export function getCustomNodeConfigs(state: AppState): CustomNodeConfig[] {
  return state.config.customNodes;
}

export function getOffline(state: AppState): boolean {
  return state.config.offline;
}

export function getForceOffline(state: AppState): boolean {
  return state.config.forceOffline;
}
