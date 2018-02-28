import { INITIAL_STATE, staticNetworks } from 'reducers/config/networks/staticNetworks';

describe('Testing contained data', () => {
  it(`contain unique chainIds`, () => {
    const networkValues = Object.values(INITIAL_STATE);
    const chainIds = networkValues.map(a => a.chainId);
    const chainIdsSet = new Set(chainIds);
    expect(Array.from(chainIdsSet).length).toEqual(chainIds.length);
  });
});

describe('static networks reducer', () => {
  it('should return the initial state', () =>
    expect(JSON.stringify(staticNetworks(undefined, {} as any))).toEqual(
      JSON.stringify(INITIAL_STATE)
    ));
});
