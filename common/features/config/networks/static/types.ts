import { StaticNetworkConfig, DPathFormats } from 'types/network';

export interface ConfigStaticNetworksState {
  [key: string]: StaticNetworkConfig;
}

export type PathType = keyof DPathFormats;
