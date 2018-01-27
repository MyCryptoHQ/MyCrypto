import { AppState } from 'reducers';
import { getConfig } from 'selectors/config';
import {
  DefaultNodeConfig,
  DefaultNodeName,
  CustomNodeConfig
} from 'reducers/config/nodes/typings';
import { INode } from 'libs/nodes/INode';

export const getNodes = (state: AppState) => getConfig(state).nodes;

export const isCurrentNodeDefault = (state: AppState): DefaultNodeConfig | undefined => {
  const { defaultNodes, selectedNode: { nodeName } } = getNodes(state);
  if (nodeName === undefined) {
    return nodeName;
  }

  const isDefaultNodeName = (networkName: string): networkName is DefaultNodeName =>
    Object.keys(defaultNodes).includes(networkName);

  const defaultNetwork = isDefaultNodeName(nodeName) ? defaultNodes[nodeName] : undefined;
  return defaultNetwork;
};

export const isCurrentNetworkCustom = (state: AppState): CustomNodeConfig | undefined => {
  const { customNodes, selectedNode: { nodeName } } = getNodes(state);

  if (nodeName === undefined) {
    return nodeName;
  }

  const customNetwork = customNodes[nodeName];
  return customNetwork;
};

export function getCustomNodeConfigs(state: AppState): CustomNodeConfig[] {
  return Object.values(getNodes(state).customNodes);
}

export function getNodeName(state: AppState): string | undefined {
  return getNodes(state).selectedNode.nodeName;
}

export function getIsWeb3Node(state: AppState): boolean {
  return getNodeName(state) === 'web3';
}

export function getNodeConfig(state: AppState): DefaultNodeConfig | CustomNodeConfig | undefined {
  return isCurrentNodeDefault(state) || isCurrentNetworkCustom(state);
}

export function getNodeLib(state: AppState): INode | undefined {
  const config = isCurrentNodeDefault(state);
  return config ? config.lib : undefined;
}
