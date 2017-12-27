import {
  NetworkConfig,
  NetworkContract,
  NodeConfig,
  CustomNodeConfig,
  CustomNetworkConfig,
  Token
} from 'config/data';
import { INode } from 'libs/nodes/INode';
import { AppState } from 'reducers';
import { getNetworkConfigFromId } from 'utils/network';
import { getUnit } from 'selectors/transaction/meta';

export function getNode(state: AppState): string {
  return state.config.nodeSelection;
}

export function getNodeConfig(state: AppState): NodeConfig {
  return state.config.node;
}

export function getNodeLib(state: AppState): INode {
  return getNodeConfig(state).lib;
}

export function getNetworkConfig(state: AppState): NetworkConfig | undefined {
  return getNetworkConfigFromId(getNodeConfig(state).network, getCustomNetworkConfigs(state));
}

export function getNetworkContracts(state: AppState): NetworkContract[] | null {
  const network = getNetworkConfig(state);
  return network ? network.contracts : [];
}

export function getNetworkTokens(state: AppState): Token[] {
  const network = getNetworkConfig(state);
  return network ? network.tokens : [];
}

export function getAllTokens(state: AppState): Token[] {
  const networkTokens = getNetworkTokens(state);
  return networkTokens.concat(state.customTokens);
}

export function getSelectedTokenContractAddress(state: AppState): string {
  const allTokens = getAllTokens(state);
  const currentUnit = getUnit(state);

  if (currentUnit === 'ether') {
    return '';
  }

  return allTokens.reduce((tokenAddr, tokenInfo) => {
    if (tokenAddr && tokenAddr.length) {
      return tokenAddr;
    }

    if (tokenInfo.symbol === currentUnit) {
      return tokenInfo.address;
    }

    return tokenAddr;
  }, '');
}

export function getLanguageSelection(state: AppState): string {
  return state.config.languageSelection;
}

export function getCustomNodeConfigs(state: AppState): CustomNodeConfig[] {
  return state.config.customNodes;
}

export function getCustomNetworkConfigs(state: AppState): CustomNetworkConfig[] {
  return state.config.customNetworks;
}

export function getOffline(state: AppState): boolean {
  return state.config.offline;
}

export function getForceOffline(state: AppState): boolean {
  return state.config.forceOffline;
}

export const isAnyOffline = (state: AppState) => getOffline(state) || getForceOffline(state);
