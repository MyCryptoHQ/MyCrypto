import { AppState } from 'reducers';
import {
  getStaticNetworkConfigs,
  getCustomNetworkConfigs,
  isStaticNetworkId
} from 'selectors/config';
import { CustomNodeConfig, StaticNodeConfig, StaticNodeId } from 'types/node';
import { StaticNetworkIds } from 'types/network';
const getConfig = (state: AppState) => state.config;
import { shepherdProvider, INode, stripWeb3Network } from 'libs/nodes';

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
    const { selectedNode } = getNodes(state);
    throw Error(`No node config found for ${selectedNode.nodeId} in either static or custom nodes`);
  }
  return config;
}

export function getNodeLib(_: AppState): INode {
  return shepherdProvider;
}

export interface NodeOption {
  isCustom: false;
  value: string;
  label: { network: string; service: string };
  color?: string;
  hidden?: boolean;
}

export function getStaticNodeOptions(state: AppState): NodeOption[] {
  const staticNetworkConfigs = getStaticNetworkConfigs(state);
  return Object.entries(getStaticNodes(state)).map(([nodeId, node]: [string, StaticNodeConfig]) => {
    const associatedNetwork =
      staticNetworkConfigs[stripWeb3Network(node.network) as StaticNetworkIds];
    const opt: NodeOption = {
      isCustom: node.isCustom,
      value: nodeId,
      label: {
        network: stripWeb3Network(node.network),
        service: node.service
      },
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
  label: {
    network: string;
    nodeName: string;
  };
  color?: string;
  hidden?: boolean;
}

export function getCustomNodeOptions(state: AppState): CustomNodeOption[] {
  const staticNetworkConfigs = getStaticNetworkConfigs(state);
  const customNetworkConfigs = getCustomNetworkConfigs(state);
  return Object.entries(getCustomNodeConfigs(state)).map(
    ([_, node]: [string, CustomNodeConfig]) => {
      const chainId = node.network;
      const associatedNetwork = isStaticNetworkId(state, chainId)
        ? staticNetworkConfigs[chainId]
        : customNetworkConfigs[chainId];
      const opt: CustomNodeOption = {
        isCustom: node.isCustom,
        value: node.id,
        label: {
          network: associatedNetwork.unit,
          nodeName: node.name
        },
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
