import uniqBy from 'lodash/uniqBy';
import difference from 'lodash/difference';
import { AppState } from 'redux/reducers';
import { InsecureWalletName, SecureWalletName, WalletName, walletNames } from 'config';
import { EXTRA_PATHS } from 'config/dpaths';
import { SHAPESHIFT_TOKEN_WHITELIST } from 'api/shapeshift';
import { stripWeb3Network, shepherdProvider, INode } from 'libs/nodes';
import {
  CustomNetworkConfig,
  StaticNetworkConfig,
  StaticNetworkIds,
  NetworkContract,
  Token
} from 'types/network';
import { CustomNodeConfig, StaticNodeConfig, StaticNodeId } from 'types/node';
import { getUnit } from 'redux/transaction/selectors';
import { PathType, DPathFormat } from './types';

const getConfig = (state: AppState) => state.config;

//#region Meta
export const getMeta = (state: AppState) => getConfig(state).meta;

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
//#endregion Meta

//#region Nodes
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

//#endregion Nodes

//#region Networks
export const getNetworks = (state: AppState) => getConfig(state).networks;

export const getNetworkConfigById = (state: AppState, networkId: string) =>
  isStaticNetworkId(state, networkId)
    ? getStaticNetworkConfigs(state)[networkId]
    : getCustomNetworkConfigs(state)[networkId];

export const getNetworkNameByChainId = (state: AppState, chainId: number | string) => {
  const network =
    Object.values(getStaticNetworkConfigs(state)).find(n => +n.chainId === +chainId) ||
    Object.values(getCustomNetworkConfigs(state)).find(n => +n.chainId === +chainId);
  if (!network) {
    return null;
  }
  return network.name;
};

export const getStaticNetworkIds = (state: AppState): StaticNetworkIds[] =>
  Object.keys(getNetworks(state).staticNetworks) as StaticNetworkIds[];

export const isStaticNetworkId = (
  state: AppState,
  networkId: string
): networkId is StaticNetworkIds =>
  Object.keys(getStaticNetworkConfigs(state)).includes(stripWeb3Network(networkId));

export const getStaticNetworkConfig = (state: AppState): StaticNetworkConfig | undefined => {
  const selectedNetwork = getSelectedNetwork(state);

  const { staticNetworks } = getNetworks(state);

  const defaultNetwork = isStaticNetworkId(state, selectedNetwork)
    ? staticNetworks[selectedNetwork]
    : undefined;
  return defaultNetwork;
};

export const getSelectedNetwork = (state: AppState) =>
  stripWeb3Network(getNodeConfig(state).network);

export const getCustomNetworkConfig = (state: AppState): CustomNetworkConfig | undefined => {
  const selectedNetwork = getSelectedNetwork(state);
  const { customNetworks } = getNetworks(state);
  const customNetwork = customNetworks[selectedNetwork];
  return customNetwork;
};

export const getNetworkConfig = (state: AppState): StaticNetworkConfig | CustomNetworkConfig => {
  const config = getStaticNetworkConfig(state) || getCustomNetworkConfig(state);

  if (!config) {
    const selectedNetwork = getSelectedNetwork(state);

    throw Error(
      `No network config found for ${selectedNetwork} in either static or custom networks`
    );
  }
  return config;
};

export const getNetworkUnit = (state: AppState): string => {
  return getNetworkConfig(state).unit;
};

export const getNetworkContracts = (state: AppState): NetworkContract[] | null => {
  const network = getStaticNetworkConfig(state);
  return network ? network.contracts : [];
};

export const getCustomNetworkConfigs = (state: AppState) => getNetworks(state).customNetworks;

export const getStaticNetworkConfigs = (state: AppState) => getNetworks(state).staticNetworks;

export const isNetworkUnit = (state: AppState, unit: string) => {
  return unit === getNetworkUnit(state);
};
//#endregion Networks

//#region Tokens
export function getNetworkTokens(state: AppState): Token[] {
  const network = getStaticNetworkConfig(state);
  return network ? network.tokens : [];
}

export function getAllTokens(state: AppState): Token[] {
  const networkTokens = getNetworkTokens(state);
  return networkTokens.concat(state.customTokens);
}

export function getSelectedTokenContractAddress(state: AppState): string {
  const allTokens = getAllTokens(state);
  const currentUnit = getUnit(state);

  if (isNetworkUnit(state, currentUnit)) {
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

export function tokenExists(state: AppState, token: string): boolean {
  const existInWhitelist = SHAPESHIFT_TOKEN_WHITELIST.includes(token);
  const existsInNetwork = !!getAllTokens(state).find(t => t.symbol === token);
  return existsInNetwork || existInWhitelist;
}

export function isSupportedUnit(state: AppState, unit: string) {
  const isToken: boolean = tokenExists(state, unit);
  const isEther: boolean = isNetworkUnit(state, unit);
  if (!isToken && !isEther) {
    return false;
  }
  return true;
}
//#endregion Tokens

//#region Wallet
export function getPaths(state: AppState, pathType: PathType): DPath[] {
  const paths = Object.values(getStaticNetworkConfigs(state))
    .reduce((networkPaths: DPath[], { dPathFormats }): DPath[] => {
      if (dPathFormats && dPathFormats[pathType]) {
        return [...networkPaths, dPathFormats[pathType] as DPath];
      }
      return networkPaths;
    }, [])
    .concat(EXTRA_PATHS);
  return uniqBy(paths, p => `${p.label}${p.value}`);
}

export function getSingleDPath(state: AppState, format: DPathFormat): DPath | undefined {
  const network = getStaticNetworkConfig(state);
  if (!network) {
    throw Error('No static network config loaded');
  }
  const dPathFormats = network.dPathFormats;
  return dPathFormats[format];
}

export function isANetworkUnit(state: AppState, unit: string) {
  const currentNetwork = getStaticNetworkConfig(state);
  //TODO: logic check
  if (!currentNetwork) {
    return false;
  }
  const networks = getStaticNetworkConfigs(state);
  const validNetworks = Object.values(networks).filter((n: StaticNetworkConfig) => n.unit === unit);
  return validNetworks.includes(currentNetwork);
}

export function isWalletFormatSupportedOnNetwork(state: AppState, format: WalletName): boolean {
  const network = getStaticNetworkConfig(state);

  const CHECK_FORMATS: DPathFormat[] = [
    SecureWalletName.LEDGER_NANO_S,
    SecureWalletName.TREZOR,
    InsecureWalletName.MNEMONIC_PHRASE
  ];

  const isHDFormat = (f: string): f is DPathFormat => CHECK_FORMATS.includes(f as DPathFormat);

  // Ensure DPath's are found
  if (isHDFormat(format)) {
    if (!network) {
      return false;
    }
    const dPath = network.dPathFormats && network.dPathFormats[format];
    return !!dPath;
  }

  // All other wallet formats are supported
  return true;
}

export function unSupportedWalletFormatsOnNetwork(state: AppState): WalletName[] {
  const supportedFormats = walletNames.filter((walletName: WalletName) =>
    isWalletFormatSupportedOnNetwork(state, walletName)
  );
  return difference(walletNames, supportedFormats);
}

//#endregion Wallet
