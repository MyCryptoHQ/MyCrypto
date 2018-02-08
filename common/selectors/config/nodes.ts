import { AppState } from 'reducers';
import {
  getStaticNetworkConfigs,
  getCustomNetworkConfigs,
  isStaticNetworkId
} from 'selectors/config';
import {
  CustomNodeConfig,
  StaticNodeConfig,
  StaticNodeId,
  Web3NodeConfig,
  StaticNodeWithWeb3Id
} from 'types/node';

const getConfig = (state: AppState) => state.config;

import { INITIAL_STATE as SELECTED_NODE_INITIAL_STATE } from 'reducers/config/nodes/selectedNode';

export const getNodes = (state: AppState) => getConfig(state).nodes;

export function isNodeCustom(state: AppState, nodeId: string): CustomNodeConfig | undefined {
  return getCustomNodeConfigs(state)[nodeId];
}

export const getCustomNodeFromId = (
  state: AppState,
  nodeId: string
): CustomNodeConfig | undefined => getCustomNodeConfigs(state)[nodeId];

export const getStaticAltNodeIdToWeb3 = (state: AppState) => {
  const { web3, ...configs } = getStaticNodeConfigs(state);
  if (!web3) {
    return SELECTED_NODE_INITIAL_STATE.nodeId;
  }
  const res = Object.entries(configs).find(
    ([_, config]: [StaticNodeId, StaticNodeConfig]) => web3.network === config.network
  );
  if (res) {
    return res[0];
  }
  return SELECTED_NODE_INITIAL_STATE.nodeId;
};

export const getStaticNodeFromId = (state: AppState, nodeId: StaticNodeId) =>
  getStaticNodeConfigs(state)[nodeId];

export const isStaticNodeId = (state: AppState, nodeId: string): nodeId is StaticNodeWithWeb3Id =>
  Object.keys(getStaticNodeConfigs(state)).includes(nodeId);

const getStaticNodeConfigs = (state: AppState) => getNodes(state).staticNodes;

export const getStaticNodeConfig = (state: AppState) => {
  const { staticNodes, selectedNode: { nodeId } } = getNodes(state);

  const defaultNetwork = isStaticNodeId(state, nodeId) ? staticNodes[nodeId] : undefined;
  return defaultNetwork;
};

export const getWeb3Node = (state: AppState): Web3NodeConfig | null => {
  const isWeb3Node = (nodeId: string, _: StaticNodeConfig | Web3NodeConfig): _ is Web3NodeConfig =>
    nodeId === 'web3';
  const currNode = getStaticNodeConfig(state);
  const currNodeId = getNodeId(state);
  if (currNode && currNodeId && isWeb3Node(currNodeId, currNode)) {
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

export function isNodeChanging(state): boolean {
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
    const { selectedNode } = getNodes(state);
    throw Error(`No node config found for ${selectedNode.nodeId} in either static or custom nodes`);
  }
  return config;
}

export function getNodeLib(state: AppState) {
  const config = getNodeConfig(state);
  if (!config) {
    throw Error('No node lib found when trying to select from state');
  }
  return config.lib;
}

export interface NodeOption {
  isCustom: false;
  value: string;
  name: { networkId?: string; service: string };
  color?: string;
  hidden?: boolean;
}

export function getStaticNodeOptions(state: AppState): NodeOption[] {
  const staticNetworkConfigs = getStaticNetworkConfigs(state);
  return Object.entries(getStaticNodes(state)).map(([nodeId, node]: [string, StaticNodeConfig]) => {
    const networkId = node.network;
    const associatedNetwork = staticNetworkConfigs[networkId];
    const opt: NodeOption = {
      isCustom: node.isCustom,
      value: nodeId,
      name: { networkId, service: node.service },
      color: associatedNetwork.color,
      hidden: node.hidden
    };
    return opt;
  });
}

export interface CustomNodeOption {
  isCustom: true;
  id: string;
  value: string;
  name: { networkId?: string; nodeId: string };
  color?: string;
  hidden?: boolean;
}

export function getCustomNodeOptions(state: AppState): CustomNodeOption[] {
  const staticNetworkConfigs = getStaticNetworkConfigs(state);
  const customNetworkConfigs = getCustomNetworkConfigs(state);
  return Object.entries(getCustomNodeConfigs(state)).map(
    ([nodeId, node]: [string, CustomNodeConfig]) => {
      const networkId = node.network;
      const associatedNetwork = isStaticNetworkId(state, networkId)
        ? staticNetworkConfigs[networkId]
        : customNetworkConfigs[networkId];
      const opt: CustomNodeOption = {
        isCustom: node.isCustom,
        value: node.id,
        name: { networkId, nodeId },
        color: associatedNetwork.isCustom ? undefined : associatedNetwork.color,
        hidden: false,
        id: node.id
      };
      return opt;
    }
  );
}

export function getNodeOptions(state: AppState) {
  return [...getStaticNodeOptions(state), ...getCustomNodeOptions(state)];
}
