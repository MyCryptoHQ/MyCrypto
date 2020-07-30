import { TAddress, TTicker } from '@types';

type StaticNetworkIds =
  | 'ETH'
  | 'Ropsten'
  | 'Kovan'
  | 'Rinkeby'
  | 'Goerli'
  | 'ETC'
  | 'RSK'
  | 'AKA'
  | 'AQUA'
  | 'ARTIS_SIGMA1'
  | 'ARTIS_TAU1'
  | 'ATH'
  | 'CLO'
  | 'DEXON'
  | 'EGEM'
  | 'ESN'
  | 'ETI'
  | 'ETHO'
  | 'EXP'
  | 'GO'
  | 'GO_TESTNET'
  | 'METADIUM'
  | 'MIX'
  | 'MUSIC'
  | 'PIRL'
  | 'POA'
  | 'REOSC'
  | 'RSK_TESTNET'
  | 'THUNDERCORE'
  | 'TOMO'
  | 'UBQ'
  | 'WEB'
  | 'AUX'
  | 'ERE'
  | 'ASK'
  | 'VOLTA'
  | 'EnergyWebChain';

export interface BlockExplorerConfig {
  name: string;
  origin: string;
  txUrl(txHash: string): string;
  addressUrl(address: string): string;
  blockUrl(blockNum: string | number): string;
}

interface Token {
  address: TAddress;
  symbol: TTicker;
  decimal: number;
  error?: string | null;
}
