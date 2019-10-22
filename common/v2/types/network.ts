import { Subtract } from 'utility-types';

import { NodeOptions } from './node';
import { BlockExplorer } from './blockExplorer';
import { GasPrice } from './gas';
import { DPathFormats } from './dPath';
import { NetworkId } from './networkId';

export interface Network {
  id: NetworkId;
  name: string;
  baseAsset: string;
  chainId: number;
  isCustom: boolean;
  isTestnet?: boolean;
  color: string | undefined;
  blockExplorer?: BlockExplorer;
  tokenExplorer?: {
    name: string;
    address(address: string): string;
  };
  assets: string[];
  contracts: string[];
  dPaths: DPathFormats;
  gasPriceSettings: GasPrice;
  shouldEstimateGasPrice?: boolean;
  nodes: NodeOptions[];
}

export interface ExtendedNetwork extends Network {
  uuid: string;
}

interface NetworkPropsMissingInLegacy {
  uuid: string;
  nodes: NodeOptions[];
  assets: string[];
  baseAsset: string;
}

interface NetworkUnusedLegacyProps {
  unit: string;
  tokens: string[];
  isTestnet?: boolean;
  unsupportedTabs?: any[];
  hideEquivalentValues?: boolean;
}

export type NetworkLegacy = Subtract<ExtendedNetwork, NetworkPropsMissingInLegacy> &
  NetworkUnusedLegacyProps;
