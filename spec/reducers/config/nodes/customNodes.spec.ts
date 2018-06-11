import { addCustomNode, removeCustomNode } from 'actions/config';
import { CustomNodeConfig } from 'types/node';
import { customNodes } from 'reducers/config/nodes/customNodes';

export const firstCustomNode: CustomNodeConfig = {
  isCustom: true,
  id: 'customNode1',
  name: 'My cool custom node',
  network: 'CustomNetworkId',
  service: 'your custom node',
  url: '127.0.0.1'
};

const secondCustomNode: CustomNodeConfig = {
  ...firstCustomNode,
  id: 'customNode2'
};

const expectedState = {
  initialState: {},
  addFirstCustomNode: { [firstCustomNode.id]: firstCustomNode },
  addSecondCustomNode: {
    [firstCustomNode.id]: firstCustomNode,
    [secondCustomNode.id]: secondCustomNode
  },
  removeFirstCustomNode: { [secondCustomNode.id]: secondCustomNode }
};

const actions = {
  addFirstCustomNode: addCustomNode(firstCustomNode),
  addSecondCustomNode: addCustomNode(secondCustomNode),
  removeFirstCustomNode: removeCustomNode(firstCustomNode.id)
};

describe('custom nodes reducer', () => {
  it('should return the initial state', () =>
    expect(customNodes(undefined, {} as any)).toEqual({}));

  it('should handle adding the first custom node', () =>
    expect(customNodes(expectedState.initialState, actions.addFirstCustomNode)).toEqual(
      expectedState.addFirstCustomNode
    ));
  it('should handle adding a second custom node', () =>
    expect(customNodes(expectedState.addFirstCustomNode, actions.addSecondCustomNode)).toEqual(
      expectedState.addSecondCustomNode
    ));
  it('should handle removing the first custom node', () =>
    expect(customNodes(expectedState.addSecondCustomNode, actions.removeFirstCustomNode)).toEqual(
      expectedState.removeFirstCustomNode
    ));
});

export { actions as customNodesActions, expectedState as customNodesExpectedState };
