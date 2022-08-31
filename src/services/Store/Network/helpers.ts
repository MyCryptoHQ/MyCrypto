import { HD_WALLETS } from '@config';
import { getAssetByUUID } from '@services/Store/Asset';
import { Asset, DPathFormat, Network, NetworkId, WalletId } from '@types';

const isHDWallet = (w: string): w is DPathFormat => {
  return Object.keys(HD_WALLETS).includes(w);
};

export const getNetworkByChainId = (
  chainId: number,
  networks: Network[] = []
): Network | undefined => {
  return networks.find((network: Network) => network.chainId === chainId);
};

export const getNetworkById = (id: NetworkId, networks: Network[] = []): Network => {
  return networks.find((network: Network) => network.id === id) as Network;
};

export const isWalletSupported = (walletId: WalletId, network: Network): boolean => {
  // Ensure DPath's are found
  if (isHDWallet(walletId)) {
    return !!(network.dPaths && network.dPaths[walletId]);
  }

  // All other wallet formats are supported
  return true;
};

export const getBaseAssetByNetwork = ({
  network,
  assets
}: {
  network: Network;
  assets: Asset[];
}): Asset | undefined => {
  return getAssetByUUID(assets)(network.baseAsset);
};
