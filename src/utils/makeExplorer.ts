import { ETHPLORER_URL } from '@config';
import { ExplorerConfig, ITxHash, TAddress } from '@types';

/**
 * Create config object for each network.
 * Allow overrides when necessary.
 */
export function makeExplorer(config: ExplorerConfig): ExplorerConfig {
  return {
    // Defaults
    // @ts-expect-error TS2783: `spread always overrites`
    // @todo: Redux. review use of makeExplorer with custom nodes to remove this
    // comment.
    origin: ETHPLORER_URL,
    txPath: 'tx',
    tokenPath: 'token',
    addressPath: 'address',
    blockPath: 'block',
    // Custom values
    ...config
  };
}
export const buildTxUrl = (config: ExplorerConfig, hash: ITxHash) =>
  `${config.origin}/${config.txPath}/${hash}`;
export const buildAddressUrl = (config: ExplorerConfig, address: TAddress) =>
  `${config.origin}/${config.addressPath}/${address}`;
export const buildBlockUrl = (config: ExplorerConfig, blockNum: number) =>
  `${config.origin}/${config.blockPath}/${blockNum}`;
export const buildTokenUrl = (config: ExplorerConfig, contractAddress: TAddress) =>
  `${config.origin}/${config.tokenPath}/${contractAddress}`;
