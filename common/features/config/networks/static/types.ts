import { StaticNetworkIds, StaticNetworkConfig } from 'types/network';

export type StaticNetworksState = { [key in StaticNetworkIds]: StaticNetworkConfig };
