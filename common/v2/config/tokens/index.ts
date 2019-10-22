import ETC from './etc.json';
import Ethereum from './eth.json';
import EXP from './exp.json';
import Kovan from './kov.json';
import Rinkeby from './rin.json';
import Ropsten from './rop.json';
import Goerli from './gor.json';
import RSK from './rsk.json';
import UBQ from './ubq.json';
import ESN from './esn.json';
import ARTIS_SIGMA1 from './artis_sigma1.json';
import ARTIS_TAU1 from './artis_tau1.json';

export interface Token {
  address: string;
  symbol: string;
  decimal: number;
  name: string;
}

// @TODO[Types]: key should really be a partial of NetworkId
export interface NetworksAssets {
  [key: string]: [Token];
}

export interface ExtendedToken {
  address: string;
  symbol: string;
  decimal: number;
  name: string;
  error?: string | null;
}

export const NetworkAssets: NetworksAssets = {
  ETC,
  Ethereum,
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
};
