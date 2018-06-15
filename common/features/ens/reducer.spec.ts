import { createStore } from 'redux';

import * as ensActions from './actions';
import * as ensReducer from './reducer';

const store = createStore(ensReducer.ensReducer);
const INITIAL_STATE = store.getState();

describe('customTokens reducer', () => {
  it('handles resolveDomainRequested', () => {
    const ensName = 'ensName';

    expect(
      ensReducer.ensReducer(undefined as any, ensActions.resolveDomainRequested(ensName))
    ).toEqual({
      ...INITIAL_STATE,
      domainRequests: { ensName: { state: 'PENDING' } },
      domainSelector: { currentDomain: 'ensName' }
    });
  });
});
