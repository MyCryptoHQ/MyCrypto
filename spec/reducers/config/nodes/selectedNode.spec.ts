import { changeNodeRequested, changeNodeSucceeded } from 'actions/config';
import { selectedNode } from 'reducers/config/nodes/selectedNode';
import { SelectedNodeState } from 'reducers/config/nodes/types';

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
    expect(selectedNode(undefined, actions.changeNode)).toEqual(expectedState.nodeChange));

  it('should handle the intent to change a node', () =>
    expect(
      selectedNode(expectedState.initialState as SelectedNodeState, actions.changeNodeRequested)
    ).toEqual(expectedState.nodeChangeIntent));
});

export { actions as selectedNodeActions, expectedState as selectedNodeExpectedState };
