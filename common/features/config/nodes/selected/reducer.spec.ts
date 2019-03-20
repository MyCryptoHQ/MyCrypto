import * as types from './types';
import * as actions from './actions';
import { selectedNodeReducer } from './reducer';

export const expectedState = {
  initialState: { nodeId: 'eth_mycrypto', prevNode: 'eth_mycrypto', pending: false },
  nodeChange: { nodeId: 'nodeToChangeTo', prevNode: 'eth_auto', pending: false },
  nodeChangeIntent: { nodeId: 'eth_mycrypto', prevNode: 'eth_mycrypto', pending: true }
};

export const actionsToDispatch = {
  changeNode: actions.changeNodeSucceeded({
    nodeId: 'nodeToChangeTo',
    networkId: 'networkToChangeTo'
  }),
  changeNodeRequested: actions.changeNodeRequested('eth_mycrypto')
};

describe('selected node reducer', () => {
  it('should handle a node change', () =>
    expect(selectedNodeReducer(undefined, actionsToDispatch.changeNode)).toEqual(
      expectedState.nodeChange
    ));

  it('should handle the intent to change a node', () =>
    expect(
      selectedNodeReducer(
        expectedState.initialState as types.ConfigNodesSelectedState,
        actionsToDispatch.changeNodeRequested
      )
    ).toEqual(expectedState.nodeChangeIntent));
});

export { actions as selectedNodeActions, expectedState as selectedNodeExpectedState };
