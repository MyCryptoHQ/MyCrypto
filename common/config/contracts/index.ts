import ETC from './etc.json';
import ETH from './eth.json';
import EXP from './exp.json';
import Rinkeby from './rinkeby.json';
import Ropsten from './ropsten.json';
import Goerli from './goerli.json';
import RSK from './rsk.json';
import UBQ from './ubq.json';
import ESN from './esn.json';
import ARTIS_SIGMA1 from './artis_sigma1.json';
import ARTIS_TAU1 from './artis_tau1.json';

export interface Network {
  name: string;
  address: string;
  abi: string;
}

export interface Networks {
  [key: string]: [Network];
}

export default {
  ETC,
  ETH,
  EXP,
  Rinkeby,
  Ropsten,
  Goerli,
  RSK,
  UBQ,
  ESN,
  ARTIS_SIGMA1,
  ARTIS_TAU1
} as Networks;
