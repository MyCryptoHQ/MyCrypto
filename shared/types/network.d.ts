import { TAB } from 'components/Header/components/constants';

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
  | 'ELLA'
  | 'EOSC'
  | 'ESN'
  | 'ETI'
  | 'ETHO'
  | 'ETSC'
  | 'EXP'
  | 'Gangnam'
  | 'GO'
  | 'GO_TESTNET'
  | 'METADIUM'
  | 'MIX'
  | 'MUSIC'
  | 'PIRL'
  | 'POA'
  | 'REOSC'
  | 'RSK_TESTNET'
  | 'SOLIDUM'
  | 'THUNDERCORE'
  | 'TOMO'
  | 'UBQ'
  | 'WEB'
  | 'AUX'
  | 'ASK';

export interface BlockExplorerConfig {
  name: string;
  origin: string;
  txUrl(txHash: string): string;
  addressUrl(address: string): string;
  blockUrl(blockNum: string | number): string;
}

interface Token {
  address: string;
  symbol: string;
  decimal: number;
  error?: string | null;
}
