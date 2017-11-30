import { NetworkConfig, CustomNetworkConfig } from 'config/data';

export function makeCustomNetworkId(config: CustomNetworkConfig): string {
  return config.chainId ? `${config.chainId}` : `${config.name}:${config.unit}`;
}

export function makeNetworkConfigFromCustomConfig(
  config: CustomNetworkConfig
): NetworkConfig {
  return {
    ...config,
    color: '#000',
    tokens: [],
    contracts: []
  };
}
