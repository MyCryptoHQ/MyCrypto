import { Omit, Subtract } from 'utility-types';

import { TAddress } from './address';
import { Asset, TTicker } from './asset';
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

export interface ExplorerConfig {
  name: string;
  origin: string;
  txPath?: string;
  addressPath?: string;
  blockPath?: string;
}

export interface Network {
  id: NetworkId;
  name: string;
  baseAsset: TUuid;
  baseUnit: TTicker;
  chainId: number;
  isCustom: boolean;
  isTestnet?: boolean;
  color: string | undefined;
  blockExplorer?: ExplorerConfig;
  tokenExplorer?: ExplorerConfig;
  assets: TUuid[];
  contracts: TUuid[];
  dPaths: DPathFormats;
  gasPriceSettings: GasPrice;
  shouldEstimateGasPrice?: boolean;
  nodes: NodeOptions[];
  selectedNode?: string;
  autoNode?: string;
}
export interface NetworkNodes {
  nodes?: NodeOptions[];
  selectedNode?: string;
}
