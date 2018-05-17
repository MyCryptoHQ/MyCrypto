import { stripWeb3Network, shepherdProvider, INode } from 'libs/nodes';
import { StaticNodeId } from 'types/node';
import { AppState } from 'features/reducers';

export const getConfig = (state: AppState) => state.config;

export function getNodes(state: AppState) {
  return getConfig(state).nodes;
}

export function getStaticNodeConfigs(state: AppState) {
  return getNodes(state).staticNodes;
}

export function isStaticNodeId(state: AppState, nodeId: string): nodeId is StaticNodeId {
  return Object.keys(getStaticNodeConfigs(state)).includes(nodeId);
}

export const getNetworks = (state: AppState) => getConfig(state).networks;

export function getStaticNetworkConfigs(state: AppState) {
  return getNetworks(state).staticNetworks;
}

export function isStaticNetworkId(
  state: AppState,
  networkId: string
): networkId is StaticNetworkIds {
  return Object.keys(getStaticNetworkConfigs(state)).includes(stripWeb3Network(networkId));
}

export function getMeta(state: AppState) {
  return getConfig(state).meta;
}

export function getOffline(state: AppState): boolean {
  return getMeta(state).offline;
}

export function getAutoGasLimitEnabled(state: AppState): boolean {
  const meta = getMeta(state);
  return meta.autoGasLimit;
}

export function getLanguageSelection(state: AppState): string {
  return getMeta(state).languageSelection;
}

export function getLatestBlock(state: AppState) {
  return getMeta(state).latestBlock;
}
