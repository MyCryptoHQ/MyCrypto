import { CustomNetworkConfig } from 'types/network';

export function makeCustomNetworkId(config: CustomNetworkConfig): string {
  return config.chainId ? `${config.chainId}` : `${config.name}:${config.unit}`;
}
