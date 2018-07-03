import { staticNetworksReducer, STATIC_NETWORKS_INITIAL_STATE } from './reducer';

describe('Testing contained data', () => {
  it(`contain unique chainIds`, () => {
    const networkValues = Object.values(STATIC_NETWORKS_INITIAL_STATE);
    const chainIds = networkValues.map(a => a.chainId);
    const chainIdsSet = new Set(chainIds);
    expect(Array.from(chainIdsSet).length).toEqual(chainIds.length);
  });
});

describe('static networks reducer', () => {
  it('should return the initial state', () =>
    expect(JSON.stringify(staticNetworksReducer(undefined, {} as any))).toEqual(
      JSON.stringify(STATIC_NETWORKS_INITIAL_STATE)
    ));
});
