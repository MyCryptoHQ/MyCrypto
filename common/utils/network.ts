import { NETWORKS, NetworkConfig, CustomNetworkConfig } from 'config';

export function makeCustomNetworkId(config: CustomNetworkConfig): string {
  return config.chainId ? `${config.chainId}` : `${config.name}:${config.unit}`;
}

export function makeNetworkConfigFromCustomConfig(config: CustomNetworkConfig): NetworkConfig {
  // this still provides the type safety we want
  // as we know config coming in is CustomNetworkConfig
  // meaning name will be a string
  // then we cast it as any to keep it as a network key

  interface Override extends NetworkConfig {
    name: any;
  }

  const customConfig: Override = {
    ...config,
    color: '#000',
    tokens: [],
    contracts: [],
    dPathFormats: null
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
