import { StaticNetworkIds, StaticNetworkConfig, DPathFormats } from 'types/network';

export type StaticNetworksState = { [key in StaticNetworkIds]: StaticNetworkConfig };

export type PathType = keyof DPathFormats;
