import { fNetworks } from '@fixtures';
import { mapObjIndexed } from '@vendor';

import { addNodesToNetworks } from '.';
import { NETWORKS_CONFIG } from './networks';
import { NODES_CONFIG } from './nodes';

describe('addNodesToNetworks', () => {
  it('appends nodes to the correct network', () => {
    const actual = addNodesToNetworks(NETWORKS_CONFIG, NODES_CONFIG);
    // take a subset to compare with our fixtures
    const sample = { Ethereum: actual['Ethereum'], Ropsten: actual['Ropsten'] };
    // asset uuids are provided by the backend and are
    // only available after app load so we remove them from the fixtures
    const expected = mapObjIndexed((n) => ({ ...n, assets: [] }), {
      Ethereum: fNetworks[0],
      Ropsten: fNetworks[1]
    });
    expect(sample).toEqual(expected);
  });
});
