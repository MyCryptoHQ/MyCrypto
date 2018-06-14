import { SelectedNodeState } from './types';
import { changeNodeRequested, changeNodeSucceeded } from './actions';
import { selectedNodeReducer } from './reducer';

export const expectedState = {
  initialState: { nodeId: 'eth_mycrypto', prevNode: 'eth_mycrypto', pending: false },
  nodeChange: { nodeId: 'nodeToChangeTo', prevNode: 'eth_auto', pending: false },
  nodeChangeIntent: { nodeId: 'eth_mycrypto', prevNode: 'eth_mycrypto', pending: true }
};

export const actions = {
  changeNode: changeNodeSucceeded({ nodeId: 'nodeToChangeTo', networkId: 'networkToChangeTo' }),
  changeNodeRequested: changeNodeRequested('eth_mycrypto')
};

describe('selected node reducer', () => {
  it('should handle a node change', () =>
    expect(selectedNodeReducer(undefined, actions.changeNode)).toEqual(expectedState.nodeChange));

  it('should handle the intent to change a node', () =>
    expect(
      selectedNodeReducer(
        expectedState.initialState as SelectedNodeState,
        actions.changeNodeRequested
      )
    ).toEqual(expectedState.nodeChangeIntent));
});

export { actions as selectedNodeActions, expectedState as selectedNodeExpectedState };
