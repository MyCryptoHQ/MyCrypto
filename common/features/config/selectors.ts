import difference from 'lodash/difference';

import { InsecureWalletName, SecureWalletName, WalletName, walletNames } from 'config';
import { SHAPESHIFT_TOKEN_WHITELIST } from 'api/shapeshift';
import { stripWeb3Network, isAutoNodeConfig } from 'libs/nodes';
import { getIsValidAddressFunction } from 'libs/validators';
import { CustomNodeConfig, StaticNodeConfig, StaticNodeId, NodeConfig } from 'types/node';
import {
  CustomNetworkConfig,
  StaticNetworkConfig,
  StaticNetworkIds,
  NetworkContract,
  Token
} from 'types/network';
import { getChecksumAddressFunction } from 'utils/formatters';
import { AppState } from 'features/reducers';
import { getNetworks } from './networks/selectors';
import { getCustomNetworkConfigs } from './networks/custom/selectors';
import { getStaticNetworkConfigs, isStaticNetworkId } from './networks/static/selectors';
import { getNodeConfig } from './nodes/selectors';
import { getCustomNodeConfigs } from './nodes/custom/selectors';
import { getStaticNodes, getStaticNodeConfigs } from './nodes/static/selectors';
import { DPathFormat } from './types';

export interface NodeOption {
  isCustom: false;
  value: string;
  label: { network: string; service: string };
  color?: string;
  hidden?: boolean;
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

export const getConfig = (state: AppState) => state.config;

//#region Network
export const getSelectedNetwork = (state: AppState) =>
  stripWeb3Network(getNodeConfig(state).network);

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

export const getStaticNetworkConfig = (state: AppState): StaticNetworkConfig | undefined => {
  const selectedNetwork = getSelectedNetwork(state);

  const { staticNetworks } = getNetworks(state);

  const defaultNetwork = isStaticNetworkId(state, selectedNetwork)
    ? staticNetworks[selectedNetwork]
    : undefined;
  return defaultNetwork;
};

export const getCustomNetworkConfig = (state: AppState): CustomNetworkConfig | undefined => {
  const selectedNetwork = getSelectedNetwork(state);
  const { customNetworks } = getNetworks(state);
  const customNetwork = customNetworks[selectedNetwork];
  return customNetwork;
};

export const getNetworkUnit = (state: AppState): string => {
  return getNetworkConfig(state).unit;
};

export const getNetworkChainId = (state: AppState) => {
  return getNetworkConfig(state).chainId;
};

export const getIsValidAddressFn = (state: AppState) => {
  const chainId = getNetworkChainId(state);
  return getIsValidAddressFunction(chainId);
};

export const getChecksumAddressFn = (state: AppState) => {
  const chainId = getNetworkChainId(state);
  return getChecksumAddressFunction(chainId);
};

export const getNetworkContracts = (state: AppState): NetworkContract[] | null => {
  const network = getStaticNetworkConfig(state);
  return network ? network.contracts : [];
};

export function getSingleDPath(state: AppState, format: DPathFormat): DPath | undefined {
  const network = getStaticNetworkConfig(state);
  if (!network) {
    throw Error('No static network config loaded');
  }
  const dPathFormats = network.dPathFormats;
  return dPathFormats[format];
}

export const isNetworkUnit = (state: AppState, unit: string) => {
  return unit === getNetworkUnit(state);
};

export function getNetworkTokens(state: AppState): Token[] {
  const network = getStaticNetworkConfig(state);
  return network ? network.tokens : [];
}

export function getAllTokens(state: AppState): Token[] {
  const networkTokens = getNetworkTokens(state);
  return networkTokens.concat(state.customTokens);
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
  const chainId = network ? network.chainId : 0;

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

  // Parity signer on RSK
  if (chainId === 30 || (chainId === 31 && format === SecureWalletName.PARITY_SIGNER)) {
    return false;
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

export const getAllNetworkConfigs = (state: AppState) => ({
  ...getStaticNetworkConfigs(state),
  ...getCustomNetworkConfigs(state)
});
//#endregion Networks

//#region Nodes
export const getStaticNodeFromId = (state: AppState, nodeId: StaticNodeId) =>
  getStaticNodeConfigs(state)[nodeId];

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
      info = 'AUTO';
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
//#endregion Nodes
