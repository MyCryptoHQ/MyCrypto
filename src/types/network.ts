import { Omit, Subtract } from 'utility-types';

import { TAddress } from './address';
import { Asset, TTicker } from './asset';
import { ExplorerConfig } from './blockExplorer';
import { Contract } from './contract';
import { DPathFormats } from './dPath';
import { GasPrice } from './gas';
import { NetworkId } from './networkId';
import { NodeOptions } from './node';
import { TUuid } from './uuid';

type AssetPropsMissingInLegacy = Pick<Asset, 'networkId'> | Pick<Asset, 'contractAddress'>;
interface AssetPropsInLegacy {
  address: TAddress;
}
export type AssetLegacy = Subtract<Asset, AssetPropsMissingInLegacy> & AssetPropsInLegacy;
export type ContractLegacy = Omit<Contract, 'networkId'> & { uuid?: TUuid };

export interface Network {
  id: NetworkId;
  name: string;
  baseAsset: TUuid;
  baseUnit: TTicker;
  chainId: number;
  isCustom: boolean;
  isTestnet?: boolean;
  color: string | undefined;
  blockExplorer: ExplorerConfig;
  tokenExplorer?: ExplorerConfig;
  dPaths: DPathFormats;
  gasPriceSettings: GasPrice;
  shouldEstimateGasPrice?: boolean;
  nodes: NodeOptions[];
  selectedNode?: string;
  baseUnitName?: string;
  supportsEIP1559?: boolean;
}

interface NetworkPropsMissingInLegacy {
  nodes: NodeOptions[];
  baseAsset: TUuid;
  baseUnit: TTicker;
}

interface NetworkUnusedLegacyProps {
  tokens: AssetLegacy[];
  contracts: ContractLegacy[];
  isTestnet?: boolean;
  unsupportedTabs?: any[];
  hideEquivalentValues?: boolean;
  unit: TTicker;
  nodes?: NodeOptions[];
}

export type NetworkLegacy = Subtract<Network, NetworkPropsMissingInLegacy> &
  NetworkUnusedLegacyProps;

export interface NetworkNodes {
  nodes?: NodeOptions[];
  selectedNode?: string;
}
