import { StaticNetworkIds, StaticNetworkConfig, DPathFormats } from 'types/network';

export type ConfigStaticNetworksState = { [key in StaticNetworkIds]: StaticNetworkConfig };

export type PathType = keyof DPathFormats;
