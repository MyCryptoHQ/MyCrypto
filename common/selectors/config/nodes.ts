import { AppState } from 'reducers';
import { getConfig, getStaticNetworkConfigs } from 'selectors/config';
import { CustomNodeConfig, StaticNodeConfig, StaticNodeName } from 'types/node';

export const getNodes = (state: AppState) => getConfig(state).nodes;

export const getStaticNodeConfig = (state: AppState): StaticNodeConfig | undefined => {
  const { staticNodes, selectedNode: { nodeName } } = getNodes(state);
  if (nodeName === undefined) {
    return nodeName;
  }

  const isStaticNodeName = (networkName: string): networkName is StaticNodeName =>
    Object.keys(staticNodes).includes(networkName);

  const defaultNetwork = isStaticNodeName(nodeName) ? staticNodes[nodeName] : undefined;
  return defaultNetwork;
};

export const getCustomNodeConfig = (state: AppState): CustomNodeConfig | undefined => {
  const { customNodes, selectedNode: { nodeName } } = getNodes(state);

  if (nodeName === undefined) {
    return nodeName;
  }

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

export function getNodeName(state: AppState): string | undefined {
  return getNodes(state).selectedNode.nodeName;
}

export function getIsWeb3Node(state: AppState): boolean {
  return getNodeName(state) === 'web3';
}

export function getNodeConfig(state: AppState): StaticNodeConfig | CustomNodeConfig | undefined {
  const config = getStaticNodeConfig(state) || getCustomNodeConfig(state);
  /*
  if (!config) {
    const { selectedNode } = getNodes(state);
    throw Error(
      `No node config found for ${selectedNode.nodeName} in either static or custom nodes`
    );
  }*/
  return config;
}

export function getNodeLib(state: AppState) {
  const config = getStaticNodeConfig(state);
  if (!config) {
    throw Error('No node lib found when trying to select from state');
  }
  return config.lib;
}

interface NodeOption {
  value: string;
  name: { networkName?: string; service: string };
  color?: string;
  hidden?: boolean;
}

export function getStaticNodeOptions(state: AppState) {
  const staticNetworkConfigs = getStaticNetworkConfigs(state);
  Object.entries(getStaticNodes(state)).map(
    ([nodeName, nodeConfig]: [string, StaticNodeConfig]) => {
      const networkName = nodeConfig.network;
      const associatedNetwork = staticNetworkConfigs[networkName];
      return {
        value: nodeName,
        name: { networkName, service: nodeConfig.service },
        color: associatedNetwork.color,
        hidden: nodeConfig.hidden
      };
    }
  );
}
