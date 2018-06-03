import { AppState } from 'reducers';
import { CustomNodeConfig, StaticNodeConfig, StaticNodeId, NodeConfig } from 'types/node';
const getConfig = (state: AppState) => state.config;
import { shepherdProvider, INode, isAutoNodeConfig } from 'libs/nodes';
import { getNetworkConfig } from './networks';

export const getNodes = (state: AppState) => getConfig(state).nodes;

export function isNodeCustom(state: AppState, nodeId: string): CustomNodeConfig | undefined {
  return getCustomNodeConfigs(state)[nodeId];
}

export const getCustomNodeFromId = (
  state: AppState,
  nodeId: string
): CustomNodeConfig | undefined => getCustomNodeConfigs(state)[nodeId];

export const getStaticNodeFromId = (state: AppState, nodeId: StaticNodeId) =>
  getStaticNodeConfigs(state)[nodeId];

export const isStaticNodeId = (state: AppState, nodeId: string): nodeId is StaticNodeId =>
  Object.keys(getStaticNodeConfigs(state)).includes(nodeId);

const getStaticNodeConfigs = (state: AppState) => getNodes(state).staticNodes;

export const getStaticNodeConfig = (state: AppState) => {
  const { staticNodes, selectedNode: { nodeId } } = getNodes(state);

  const defaultNetwork = isStaticNodeId(state, nodeId) ? staticNodes[nodeId] : undefined;
  return defaultNetwork;
};

export const getWeb3Node = (state: AppState): StaticNodeConfig | null => {
  const isWeb3Node = (nodeId: string) => nodeId === 'web3';
  const currNode = getStaticNodeConfig(state);
  const currNodeId = getNodeId(state);
  if (currNode && currNodeId && isWeb3Node(currNodeId)) {
    return currNode;
  }
  return null;
};

export const getCustomNodeConfig = (state: AppState): CustomNodeConfig | undefined => {
  const { customNodes, selectedNode: { nodeId } } = getNodes(state);

  const customNode = customNodes[nodeId];
  return customNode;
};

export function getCustomNodeConfigs(state: AppState) {
  return getNodes(state).customNodes;
}

export function getStaticNodes(state: AppState) {
  return getNodes(state).staticNodes;
}

export function getSelectedNode(state: AppState) {
  return getNodes(state).selectedNode;
}

export function getPreviouslySelectedNode(state: AppState) {
  return getSelectedNode(state).prevNode;
}

export function isNodeChanging(state: AppState): boolean {
  return getSelectedNode(state).pending;
}

export function getNodeId(state: AppState): string {
  return getSelectedNode(state).nodeId;
}

export function getIsWeb3Node(state: AppState): boolean {
  return getNodeId(state) === 'web3';
}

export function getNodeConfig(state: AppState): StaticNodeConfig | CustomNodeConfig {
  const config = getStaticNodeConfig(state) || getCustomNodeConfig(state);

  if (!config) {
    const nodeId = getNodeId(state);
    throw Error(`No node config found for ${nodeId} in either static or custom nodes`);
  }
  return config;
}

export function getNodeLib(_: AppState): INode {
  return shepherdProvider;
}

export function getAllNodes(state: AppState): { [key: string]: NodeConfig } {
  return {
    ...getStaticNodes(state),
    ...getCustomNodeConfigs(state)
  };
}

export interface INodeLabel {
  network: string;
  info: string;
}

export function getSelectedNodeLabel(state: AppState): INodeLabel {
  const allNodes = getAllNodes(state);
  const node = getNodeConfig(state);
  const network = getNetworkConfig(state);
  let info;

  if (node.isCustom) {
    // Custom nodes have names
    info = node.name;
  } else if (node.isAuto) {
    // Auto nodes should show the count of all nodes it uses. If only one,
    // show the service name of the node.
    const networkNodes = Object.values(allNodes).filter(
      n => !isAutoNodeConfig(n) && n.network === node.network
    );

    if (networkNodes.length > 1) {
      info = `${networkNodes.length} Nodes`;
    } else {
      info = networkNodes[0].service;
    }
  } else {
    info = node.service;
  }

  return {
    network: network.name,
    info
  };
}
