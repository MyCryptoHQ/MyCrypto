import { NETWORKS, NetworkConfig } from 'config';

describe('Networks', () => {
  Object.keys(NETWORKS).forEach(networkId => {
    it(`${networkId} contains non-null dPathFormats`, () => {
      const network: NetworkConfig = NETWORKS[networkId];
      Object.values(network.dPathFormats).forEach(dPathFormat => {
        expect(dPathFormat).toBeTruthy();
      });
    });
  });

  it(`contain unique chainIds`, () => {
    const networkValues = Object.values(NETWORKS);
    const chainIds = networkValues.map(a => a.chainId);
    const chainIdsSet = new Set(chainIds);
    expect(Array.from(chainIdsSet).length).toEqual(chainIds.length);
  });
});
