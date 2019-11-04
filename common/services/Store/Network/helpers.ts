import { getAccountByAddress, getAssetByUUID } from 'services/Store';
import {
  Asset,
  Account,
  DPathFormat,
  LocalCache,
  INetwork,
  NetworkId,
  NodeOptions,
  WalletId
} from 'typeFiles';
import { HD_WALLETS } from 'config';
import { getCache, setCache } from '../LocalCache';

export const getAllNetworks = () => {
  return Object.values(getCache().networks);
};

export const getNetworkByAddress = (address: string): INetwork | undefined => {
  const account: Account | undefined = getAccountByAddress(address);
  if (account) {
    const networks = getAllNetworks();
    return networks.find(network => account.networkId === network.id);
  }
};
export const getNetworkByChainId = (chainId: number): INetwork | undefined => {
  const networks = getAllNetworks() || [];
  return networks.find((network: INetwork) => network.chainId === chainId);
};

export const getNetworkByName = (name: string): INetwork | undefined => {
  const networks = getAllNetworks() || [];
  return networks.find((network: INetwork) => network.name === name);
};

export const getNetworkById = (id: NetworkId): INetwork | undefined => {
  const networks = getAllNetworks() || [];
  return networks.find((network: INetwork) => network.id === id);
};

export const isWalletFormatSupportedOnNetwork = (network: INetwork, format: WalletId): boolean => {
  const chainId = network ? network.chainId : 0;

  const CHECK_FORMATS: DPathFormat[] = Object.keys(HD_WALLETS) as DPathFormat[];

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
  if ((chainId === 30 || chainId === 31) && format === WalletId.PARITY_SIGNER) {
    return false;
  }

  // All other wallet formats are supported
  return true;
};

export const getAllNodes = (): NodeOptions[] => {
  const networks: INetwork[] = getAllNetworks();
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

export const createNode = (node: NodeOptions, network: INetwork): void => {
  const newStorage: LocalCache = getCache();
  newStorage.networks[network.id].nodes.push(node);
  setCache(newStorage);
};

export const getBaseAssetByNetwork = (networkObj: INetwork): Asset | undefined => {
  return getAssetByUUID(networkObj.baseAsset);
};

export const getBaseAssetSymbolByNetwork = (networkObj: INetwork): string | undefined => {
  const baseAsset: Asset | undefined = getAssetByUUID(networkObj.baseAsset);
  return baseAsset ? baseAsset.ticker : undefined;
};
