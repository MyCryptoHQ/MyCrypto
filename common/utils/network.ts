import {
  CustomNetworkConfig,
  DPathFormats,
  InsecureWalletName,
  NetworkConfig,
  NETWORKS,
  SecureWalletName,
  WalletName
} from 'config';
import { DPath } from 'config/dpaths';
import sortedUniq from 'lodash/sortedUniq';

export function makeCustomNetworkId(config: CustomNetworkConfig): string {
  return config.chainId ? `${config.chainId}` : `${config.name}:${config.unit}`;
}

export function makeNetworkConfigFromCustomConfig(config: CustomNetworkConfig): NetworkConfig {
  // this still provides the type safety we want
  // as we know config coming in is CustomNetworkConfig
  // meaning name will be a string
  // then we cast it as any to keep it as a network key
  // interface Override extends NetworkConfig {
  //   name: any;
  // }

  // TODO - allow for user-inputted dpaths so we don't need to use any below and can use supplied dPaths
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
  const paths: DPath[] = [];
  Object.values(NETWORKS).forEach(networkConfig => {
    const path = networkConfig.dPathFormats ? networkConfig.dPathFormats[pathType] : [];
    if (path) {
      paths.push(path as DPath);
    }
  });
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

export function isSupportedWalletFormat(format: WalletName, network: NetworkConfig): boolean {
  const CHECK_FORMATS: DPathFormat[] = [
    SecureWalletName.LEDGER_NANO_S,
    SecureWalletName.TREZOR,
    InsecureWalletName.MNEMONIC_PHRASE
  ];

  const isHDFormat = (f: string): f is DPathFormat => CHECK_FORMATS.includes(f as DPathFormat);

  // Ensure DPath's are found
  if (isHDFormat(format)) {
    return !!(network.dPathFormats && network.dPathFormats[format]);
  }

  // Ensure Web3 is only enabled on ETH or ETH Testnets (MetaMask does not support other networks)
  if (format === SecureWalletName.WEB3) {
    return isNetworkUnit(network, 'ETH');
  }

  // All other wallet formats are supported
  return true;
}
