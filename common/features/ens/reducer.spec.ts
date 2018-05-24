import { createStore } from 'redux';

import { resolveDomainRequested } from './actions';
import { ensReducer } from './';

const store = createStore(ensReducer);
const INITIAL_STATE = store.getState();

describe('customTokens reducer', () => {
  it('handles resolveDomainRequested', () => {
    const ensName = 'ensName';

    expect(ensReducer(undefined as any, resolveDomainRequested(ensName))).toEqual({
      ...INITIAL_STATE,
      domainRequests: { ensName: { state: 'PENDING' } },
      domainSelector: { currentDomain: 'ensName' }
    });
  });
});
