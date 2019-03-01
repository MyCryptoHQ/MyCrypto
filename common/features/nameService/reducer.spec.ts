import { createStore } from 'redux';

import * as actions from './actions';
import * as reducer from './reducer';

const store = createStore(reducer.nameServiceReducer);
const INITIAL_STATE = store.getState();

describe('customTokens reducer', () => {
  it('handles resolveDomainRequested', () => {
    const ensName = 'ensName';

    expect(
      reducer.nameServiceReducer(undefined as any, actions.resolveDomainRequested(ensName))
    ).toEqual({
      ...INITIAL_STATE,
      domainRequests: { ensName: { state: 'PENDING' } },
      domainSelector: { currentDomain: 'ensName' }
    });
  });
});
