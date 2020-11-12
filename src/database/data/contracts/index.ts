import { Contract, NetworkId } from '@types';
import { generateDeterministicAddressUUID } from '@utils';
// @todo: solve circular dependency issues
import { toArray } from '@utils/toArray';
import { toObject } from '@utils/toObject';
import { flatten, map, mapObjIndexed, pipe } from '@vendor';

import ARTIS_SIGMA1 from './artis_sigma1.json';
import ARTIS_TAU1 from './artis_tau1.json';
import ESN from './esn.json';
import ETC from './etc.json';
import Ethereum from './eth.json';
import EXP from './exp.json';
import Goerli from './goerli.json';
import PIRL from './pirl.json';
import Rinkeby from './rinkeby.json';
import Ropsten from './ropsten.json';
import RSK from './rsk.json';
import UBQ from './ubq.json';

const CONTRACTS_JSON = {
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
} as Record<Partial<NetworkId>, Contract[]>;

const formatJSONToContract = (value: Contract[], key: NetworkId) =>
  pipe(
    map((c: Contract) => ({ ...c, networkId: key })),
    map((c: Contract) => ({
      ...c,
      uuid: generateDeterministicAddressUUID(c.networkId, c.address)
    })),
    map((c: Contract) => ({ ...c, isCustom: false }))
  )(value);

/**
 * Test only export
 * From: { ETC: Contract[], Ethereum: Contract[] }
 * To: { 'uuid1': Contract, 'uuid2': Contract }
 */
export const flattenContracts = pipe(
  mapObjIndexed(formatJSONToContract),
  toArray,
  flatten,
  toObject('uuid')
);

export const CONTRACTS = flattenContracts(CONTRACTS_JSON);
