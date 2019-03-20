import ETC from './etc.json';
import ETH from './eth.json';
import EXP from './exp.json';
import Rinkeby from './rinkeby.json';
import Ropsten from './ropsten.json';
import RSK from './rsk.json';
import UBQ from './ubq.json';
import ESN from './esn.json';

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
  RSK,
  UBQ,
  ESN
} as Networks;
