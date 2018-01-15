import { ens } from 'reducers/ens';
import * as ensActions from 'actions/ens';
import { createStore } from 'redux';
const store = createStore(ens);
const INITIAL_STATE = store.getState();

describe('customTokens reducer', () => {
  it('handles resolveDomainRequested', () => {
    const ensName = 'ensName';
    expect(ens(undefined as any, ensActions.resolveDomainRequested(ensName))).toEqual({
      ...INITIAL_STATE,
      domainRequests: { ensName: { state: 'PENDING' } },
      domainSelector: { currentDomain: 'ensName' }
    });
  });
});
