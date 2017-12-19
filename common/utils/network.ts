import { NETWORKS, NetworkConfig, CustomNetworkConfig } from 'config/data';

export function makeCustomNetworkId(config: CustomNetworkConfig): string {
  return config.chainId ? `${config.chainId}` : `${config.name}:${config.unit}`;
}

export function makeNetworkConfigFromCustomConfig(config: CustomNetworkConfig): NetworkConfig {
  return {
    ...config,
    color: '#000',
    tokens: [],
    contracts: []
  };
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
