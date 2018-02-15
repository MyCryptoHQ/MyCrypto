import ETC from './etc.json';
import ETH from './eth.json';
import EXP from './exp.json';
import Kovan from './kovan.json';
import Rinkeby from './rinkeby.json';
import Ropsten from './ropsten.json';
import RSK from './rsk.json';
import UBQ from './ubq.json';

export interface Token {
  address: string;
  symbol: string;
  decimal: number;
  error?: string | null;
}
export interface Tokens {
  [key: string]: Token[];
}

const TokenTypes: Tokens = {
  ETC,
  ETH,
  EXP,
  Kovan,
  Rinkeby,
  Ropsten,
  RSK,
  UBQ
};

export default TokenTypes;
