import { SecureWalletName, InsecureWalletName } from 'config/data';

import { getCache, setCache } from '../LocalCache';
import { getAccountByAddress, getAssetByUUID } from 'v2/services/Store';
import {
  Asset,
  Account,
  DPathFormat,
  LocalCache,
  Network,
  NodeOptions,
  WalletName
} from 'v2/types';

export const getAllNetworks = () => {
  return Object.values(getCache().networks);
};

export const getNetworkByAddress = (address: string): Network | undefined => {
  const account: Account | undefined = getAccountByAddress(address);
  if (account) {
    const networks = getAllNetworks();
    return networks.find(network => account.network === network.name);
  }
};
export const getNetworkByChainId = (chainId: number): Network | undefined => {
  const networks = getAllNetworks() || [];
  return networks.find((network: Network) => network.chainId === chainId);
};

export const getNetworkByName = (name: string): Network | undefined => {
  const networks = getAllNetworks() || [];
  return networks.find((network: Network) => network.name === name);
};

export const getNetworkById = (id: string): Network | undefined => {
  const networks = getAllNetworks() || [];
  return networks.find((network: Network) => network.id === id);
};

export const isWalletFormatSupportedOnNetwork = (network: Network, format: WalletName): boolean => {
  const chainId = network ? network.chainId : 0;

  const CHECK_FORMATS: DPathFormat[] = [
    SecureWalletName.LEDGER_NANO_S,
    SecureWalletName.TREZOR,
    SecureWalletName.SAFE_T,
    InsecureWalletName.MNEMONIC_PHRASE
  ];

  const isHDFormat = (f: string): f is DPathFormat => CHECK_FORMATS.includes(f as DPathFormat);

  // Ensure DPath's are found
  if (isHDFormat(format)) {
    if (!network) {
      return false;
    }
    const dPath: DPath | undefined = network.dPaths && network.dPaths[format];
    return !!dPath;
  }

  // Parity signer on RSK
  if ((chainId === 30 || chainId === 31) && format === SecureWalletName.PARITY_SIGNER) {
    return false;
  }

  // All other wallet formats are supported
  return true;
};

export const getAllNodes = (): NodeOptions[] => {
  const networks: Network[] = getAllNetworks();
  return networks.flatMap(network => network.nodes);
};

export const getNodesByNetwork = (network: string): NodeOptions[] => {
  const networkObject = getNetworkByName(network);
  return networkObject ? networkObject.nodes : [];
};

export const getNodeByName = (name: string): NodeOptions | undefined => {
  const nodes = getAllNodes() || [];
  return nodes.find((node: NodeOptions) => node.name === name);
};

export const createNode = (node: NodeOptions, network: Network): void => {
  const newStorage: LocalCache = getCache();
  newStorage.networks[network.id].nodes.push(node);
  setCache(newStorage);
};

export const getBaseAssetByNetwork = (networkObj: Network): Asset | undefined => {
  return getAssetByUUID(networkObj.baseAsset);
};

export const getBaseAssetSymbolByNetwork = (networkObj: Network): string | undefined => {
  const baseAsset: Asset | undefined = getAssetByUUID(networkObj.baseAsset);
  return baseAsset ? baseAsset.ticker : undefined;
};
