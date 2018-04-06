import { changeNodeIntent, changeNode } from 'actions/config';
import { selectedNode } from 'reducers/config/nodes/selectedNode';
import { SelectedNodeState } from 'reducers/config/nodes/types';

export const expectedState = {
  initialState: { nodeId: 'eth_mycrypto', pending: false },
  nodeChange: { nodeId: 'nodeToChangeTo', pending: false },
  nodeChangeIntent: { nodeId: 'eth_mycrypto', pending: true }
};

export const actions = {
  changeNode: changeNode({ nodeId: 'nodeToChangeTo', networkId: 'networkToChangeTo' }),
  changeNodeIntent: changeNodeIntent('eth_mycrypto')
};

describe('selected node reducer', () => {
  it(' should return the initial state', () =>
    expect(selectedNode(undefined, {} as any)).toEqual(expectedState.initialState));

  it('should handle a node change', () =>
    expect(selectedNode(undefined, actions.changeNode)).toEqual(expectedState.nodeChange));

  it('should handle the intent to change a node', () =>
    expect(
      selectedNode(expectedState.initialState as SelectedNodeState, actions.changeNodeIntent)
    ).toEqual(expectedState.nodeChangeIntent));
});

export { actions as selectedNodeActions, expectedState as selectedNodeExpectedState };
