import { Contract } from '@types';

import ETC from './etc.json';
import Ethereum from './eth.json';
import EXP from './exp.json';
import Rinkeby from './rinkeby.json';
import Ropsten from './ropsten.json';
import Goerli from './goerli.json';
import RSK from './rsk.json';
import UBQ from './ubq.json';
import ESN from './esn.json';
import ARTIS_SIGMA1 from './artis_sigma1.json';
import ARTIS_TAU1 from './artis_tau1.json';
import PIRL from './pirl.json';

// @TODO[Types]: key should really be a partial of NetworkId
interface Contracts {
  [key: string]: Contract[];
}

export const Contracts: Contracts = {
  ETC,
  Ethereum,
  EXP,
  Rinkeby,
  Ropsten,
  Goerli,
  RSK,
  UBQ,
  ESN,
  ARTIS_SIGMA1,
  ARTIS_TAU1,
  PIRL
};
