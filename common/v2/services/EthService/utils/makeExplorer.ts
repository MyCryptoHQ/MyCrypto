import { BlockExplorer } from 'v2/types';

interface ExplorerConfig {
  name: string;
  origin: string;
  txPath?: string;
  addressPath?: string;
  blockPath?: string;
}

export function makeExplorer(expConfig: ExplorerConfig): BlockExplorer {
  const config: ExplorerConfig = {
    // Defaults
    txPath: 'tx',
    addressPath: 'address',
    blockPath: 'block',
    ...expConfig
  };

  return {
    name: config.name,
    origin: config.origin,
    txUrl: hash => `${config.origin}/${config.txPath}/${hash}`,
    addressUrl: address => `${config.origin}/${config.addressPath}/${address}`,
    blockUrl: blockNum => `${config.origin}/${config.blockPath}/${blockNum}`
  };
}
