import {
  CustomNetworkConfig,
  DPathFormats,
  InsecureWalletName,
  NetworkConfig,
  NETWORKS,
  SecureWalletName,
  WalletName,
  walletNames
} from 'config';
import { DPath, EXTRA_PATHS } from 'config/dpaths';
import sortedUniq from 'lodash/sortedUniq';
import difference from 'lodash/difference';

export function makeCustomNetworkId(config: CustomNetworkConfig): string {
  return config.chainId ? `${config.chainId}` : `${config.name}:${config.unit}`;
}

export function makeNetworkConfigFromCustomConfig(config: CustomNetworkConfig): NetworkConfig {
  // TODO - re-enable this block and classify customConfig after user-inputted dPaths are implemented
  // -------------------------------------------------
  // this still provides the type safety we want
  // as we know config coming in is CustomNetworkConfig
  // meaning name will be a string
  // then we cast it as any to keep it as a network key
  // interface Override extends NetworkConfig {
  //   name: any;
  // }
  // -------------------------------------------------

  // TODO - allow for user-inputted dPaths so we don't need to use any below and can use supplied dPaths
  // In the meantime, networks with an unknown chainId will have HD wallets disabled
  const customConfig: any = {
    ...config,
    color: '#000',
    tokens: [],
    contracts: []
  };

  return customConfig;
}

export function getNetworkConfigFromId(
  id: string,
  configs: CustomNetworkConfig[]
): NetworkConfig | undefined {
  if (NETWORKS[id]) {
    return NETWORKS[id];
  }

  const customConfig = configs.find(conf => makeCustomNetworkId(conf) === id);
  if (customConfig) {
    return makeNetworkConfigFromCustomConfig(customConfig);
  }
}

type PathType = keyof DPathFormats;

type DPathFormat =
  | SecureWalletName.TREZOR
  | SecureWalletName.LEDGER_NANO_S
  | InsecureWalletName.MNEMONIC_PHRASE;

export function getPaths(pathType: PathType): DPath[] {
  const networkPaths: DPath[] = [];
  Object.values(NETWORKS).forEach(networkConfig => {
    const path = networkConfig.dPathFormats ? networkConfig.dPathFormats[pathType] : [];
    if (path) {
      networkPaths.push(path as DPath);
    }
  });
  const paths = networkPaths.concat(EXTRA_PATHS);
  return sortedUniq(paths);
}

export function getSingleDPath(format: DPathFormat, network: NetworkConfig): DPath {
  const dPathFormats = network.dPathFormats;
  return dPathFormats[format];
}

export function isNetworkUnit(network: NetworkConfig, unit: string) {
  const validNetworks = Object.values(NETWORKS).filter((n: NetworkConfig) => n.unit === unit);
  return validNetworks.includes(network);
}

export function isWalletFormatSupportedOnNetwork(
  format: WalletName,
  network: NetworkConfig
): boolean {
  const CHECK_FORMATS: DPathFormat[] = [
    SecureWalletName.LEDGER_NANO_S,
    SecureWalletName.TREZOR,
    InsecureWalletName.MNEMONIC_PHRASE
  ];

  const isHDFormat = (f: string): f is DPathFormat => CHECK_FORMATS.includes(f as DPathFormat);

  // Ensure DPath's are found
  if (isHDFormat(format)) {
    const dPath = network.dPathFormats && network.dPathFormats[format];
    return !!dPath;
  }

  // Ensure Web3 is only enabled on ETH or ETH Testnets (MetaMask does not support other networks)
  if (format === SecureWalletName.WEB3) {
    return isNetworkUnit(network, 'ETH');
  }

  // All other wallet formats are supported
  return true;
}

export function allWalletFormatsSupportedOnNetwork(network: NetworkConfig): WalletName[] {
  return walletNames.filter(walletName => isWalletFormatSupportedOnNetwork(walletName, network));
}

export function unSupportedWalletFormatsOnNetwork(network: NetworkConfig): WalletName[] {
  const supportedFormats = allWalletFormatsSupportedOnNetwork(network);
  return difference(walletNames, supportedFormats);
}
