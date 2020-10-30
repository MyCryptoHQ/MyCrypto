import { ExplorerConfig, ITxHash, TAddress } from '@types';

export function makeExplorer(expConfig: ExplorerConfig): ExplorerConfig {
  return {
    // Defaults
    txPath: 'tx',
    addressPath: 'address',
    blockPath: 'block',
    ...expConfig
  };
}

export const buildTxUrl = (config: ExplorerConfig, hash: ITxHash) =>
  `${config.origin}/${config.txPath}/${hash}`;
export const buildAddressUrl = (config: ExplorerConfig, address: TAddress) =>
  `${config.origin}/${config.addressPath}/${address}`;
export const buildBlockUrl = (config: ExplorerConfig, blockNum: number) =>
  `${config.origin}/${config.blockPath}/${blockNum}`;
