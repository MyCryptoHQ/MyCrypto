import { AppState } from 'reducers';
import {
  getConfig,
  getStaticNetworkConfigs,
  getCustomNetworkConfigs,
  isStaticNetworkName
} from 'selectors/config';
import { CustomNodeConfig, StaticNodeConfig, StaticNodeName, Web3NodeConfig } from 'types/node';
import { INITIAL_STATE as SELECTED_NODE_INITIAL_STATE } from 'reducers/config/nodes/selectedNode';

export const getNodes = (state: AppState) => getConfig(state).nodes;

export function isNodeCustom(state: AppState, nodeName: string): CustomNodeConfig | undefined {
  return getCustomNodeConfigs(state)[nodeName];
}

export const getCustomNodeFromId = (
  state: AppState,
  nodeName: string
): CustomNodeConfig | undefined => getCustomNodeConfigs(state)[nodeName];

export const getStaticAltNodeToWeb3 = (state: AppState) => {
  const { web3, ...configs } = getStaticNodeConfigs(state);
  if (!web3) {
    return SELECTED_NODE_INITIAL_STATE.nodeName;
  }
  const res = Object.entries(configs).find(
    ([_, config]: [StaticNodeName, StaticNodeConfig]) => web3.network === config.network
  );
  if (res) {
    return res[0];
  }
  return SELECTED_NODE_INITIAL_STATE.nodeName;
};

export const getStaticNodeFromId = (state: AppState, nodeName: StaticNodeName) =>
  getStaticNodeConfigs(state)[nodeName];

export const isStaticNodeName = (state: AppState, nodeName: string): nodeName is StaticNodeName =>
  Object.keys(getStaticNodeConfigs(state)).includes(nodeName);

const getStaticNodeConfigs = (state: AppState) => getNodes(state).staticNodes;

export const getStaticNodeConfig = (state: AppState): StaticNodeConfig | undefined => {
  const { staticNodes, selectedNode: { nodeName } } = getNodes(state);

  const defaultNetwork = isStaticNodeName(state, nodeName) ? staticNodes[nodeName] : undefined;
  return defaultNetwork;
};

export const getWeb3Node = (state: AppState): Web3NodeConfig | null => {
  const currNode = getStaticNodeConfig(state);
  const currNodeName = getNodeName(state);
  if (
    currNode &&
    currNodeName &&
    isStaticNodeName(state, currNodeName) &&
    currNodeName === 'web3'
  ) {
    return currNode;
  }
  return null;
};

export const getCustomNodeConfig = (state: AppState): CustomNodeConfig | undefined => {
  const { customNodes, selectedNode: { nodeName } } = getNodes(state);

  const customNode = customNodes[nodeName];
  return customNode;
};

export function getCustomNodeConfigs(state: AppState) {
  return getNodes(state).customNodes;
}

export function getStaticNodes(state: AppState) {
  return getNodes(state).staticNodes;
}

export function isNodeChanging(state): boolean {
  return getNodes(state).selectedNode.pending;
}

export function getNodeName(state: AppState): string {
  return getNodes(state).selectedNode.nodeName;
}

export function getIsWeb3Node(state: AppState): boolean {
  return getNodeName(state) === 'web3';
}

export function getNodeConfig(state: AppState): StaticNodeConfig | CustomNodeConfig {
  const config = getStaticNodeConfig(state) || getCustomNodeConfig(state);

  if (!config) {
    const { selectedNode } = getNodes(state);
    throw Error(
      `No node config found for ${selectedNode.nodeName} in either static or custom nodes`
    );
  }
  return config;
}

export function getNodeLib(state: AppState) {
  const config = getStaticNodeConfig(state);
  if (!config) {
    throw Error('No node lib found when trying to select from state');
  }
  return config.lib;
}

export interface NodeOption {
  isCustom: false;
  value: string;
  name: { networkName?: string; service: string };
  color?: string;
  hidden?: boolean;
}

export function getStaticNodeOptions(state: AppState): NodeOption[] {
  const staticNetworkConfigs = getStaticNetworkConfigs(state);
  return Object.entries(getStaticNodes(state)).map(
    ([nodeName, node]: [string, StaticNodeConfig]) => {
      const networkName = node.network;
      const associatedNetwork = staticNetworkConfigs[networkName];
      const opt: NodeOption = {
        isCustom: node.isCustom,
        value: nodeName,
        name: { networkName, service: node.service },
        color: associatedNetwork.color,
        hidden: node.hidden
      };
      return opt;
    }
  );
}

export interface CustomNodeOption {
  isCustom: true;
  id: string;
  value: string;
  name: { networkName?: string; nodeName: string };
  color?: string;
  hidden?: boolean;
}

export function getCustomNodeOptions(state: AppState): CustomNodeOption[] {
  const staticNetworkConfigs = getStaticNetworkConfigs(state);
  const customNetworkConfigs = getCustomNetworkConfigs(state);
  return Object.entries(getCustomNodeConfigs(state)).map(
    ([nodeName, node]: [string, CustomNodeConfig]) => {
      const networkName = node.network;
      const associatedNetwork = isStaticNetworkName(state, networkName)
        ? staticNetworkConfigs[networkName]
        : customNetworkConfigs[networkName];
      const opt: CustomNodeOption = {
        isCustom: node.isCustom,
        value: node.id,
        name: { networkName, nodeName },
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
