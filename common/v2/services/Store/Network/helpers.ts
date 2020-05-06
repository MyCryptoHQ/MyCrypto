import { getAssetByUUID } from 'v2/services/Store';
import { Asset, DPathFormat, Network, NetworkId, WalletId } from 'v2/types';
import { HD_WALLETS } from 'v2/config';

export const getNetworkByChainId = (
  chainId: number,
  networks: Network[] = []
): Network | undefined => {
  return networks.find((network: Network) => network.chainId === chainId);
};

export const getNetworkById = (id: NetworkId, networks: Network[] = []): Network => {
  return networks.find((network: Network) => network.id === id) as Network;
};

export const isWalletFormatSupportedOnNetwork = (network: Network, format: WalletId): boolean => {
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
