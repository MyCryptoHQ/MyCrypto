import ETC from './etc.json';
import ETH from './eth.json';
import EXP from './exp.json';
import Rinkeby from './rinkeby.json';
import Ropsten from './ropsten.json';
import RSK from './rsk.json';
import UBQ from './ubq.json';

export interface ContractData {
  name: string;
  address: string;
  abi: string;
}
export interface Networks {
  [key: string]: ContractData[];
}

const NetworkTypes: Networks = {
  ETC,
  ETH,
  EXP,
  Rinkeby,
  Ropsten,
  RSK,
  UBQ
};

export default NetworkTypes;
