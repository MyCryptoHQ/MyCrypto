import { ens, INITIAL_STATE } from 'reducers/ens';
import * as ensActions from 'actions/ens';

describe('customTokens reducer', () => {
  it('should handle ENS_CACHE', () => {
    const ensName = 'ensName';
    const address = 'address';
    expect(
      ens(undefined, ensActions.cacheEnsAddress(ensName, address))
    ).toEqual({
      ...INITIAL_STATE,
      [ensName]: address
    });
  });
});
