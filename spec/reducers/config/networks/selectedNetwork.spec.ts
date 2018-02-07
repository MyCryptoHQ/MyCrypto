import { actions } from '../nodes/selectedNode.spec';
import { selectedNetwork } from 'reducers/config/networks/selectedNetwork';

const expectedState = {
  initialState: 'ETH',
  nodeChange: 'networkToChangeTo'
};

describe('selected network reducer', () => {
  it('should return the initial state', () =>
    expect(selectedNetwork(undefined, {} as any)).toEqual(expectedState.initialState));
  it('should handle changing nodes by changing to the right network', () =>
    expect(selectedNetwork(expectedState.initialState, actions.changeNode)).toEqual(
      expectedState.nodeChange
    ));
});

export { actions as selectedNetworkActions, expectedState as selectedNetworkExpectedState };
