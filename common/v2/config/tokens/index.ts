import ETC from './etc.json';
import ETH from './eth.json';
import EXP from './exp.json';
import Kovan from './kovan.json';
import Rinkeby from './rinkeby.json';
import Ropsten from './ropsten.json';
import Goerli from './goerli.json';
import RSK from './rsk.json';
import UBQ from './ubq.json';
import ESN from './esn.json';
import ARTIS_SIGMA1 from './artis_sigma1.json';
import ARTIS_TAU1 from './artis_tau1.json';

export interface Asset {
  address: string;
  symbol: string;
  decimal: number;
  name: string;
}

export interface NetworksAssets {
  [key: string]: [Asset];
}

export interface ExtendedToken {
  address: string;
  symbol: string;
  decimal: number;
  name: string;
  error?: string | null;
}

export default {
  ETC,
  ETH,
  EXP,
  Kovan,
  Rinkeby,
  Ropsten,
  Goerli,
  RSK,
  UBQ,
  ESN,
  ARTIS_SIGMA1,
  ARTIS_TAU1
} as NetworksAssets;
