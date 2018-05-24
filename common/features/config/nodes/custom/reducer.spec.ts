import { CustomNodeConfig } from 'types/node';
import { customNodesReducer, addCustomNode, removeCustomNode } from '.';

const firstCustomNodeId = 'customNode1';
const firstCustomNode: CustomNodeConfig = {
  isCustom: true,
  id: firstCustomNodeId,
  lib: jest.fn() as any,
  name: 'My cool custom node',
  network: 'CustomNetworkId',
  service: 'your custom node',
  url: '127.0.0.1'
};
const secondCustomNodeId = 'customNode2';
const secondCustomNode: CustomNodeConfig = {
  ...firstCustomNode,
  id: secondCustomNodeId
};
const customNodesExpectedState = {
  initialState: {},
  addFirstCustomNode: { [firstCustomNodeId]: firstCustomNode },
  addSecondCustomNode: {
    [firstCustomNodeId]: firstCustomNode,
    [secondCustomNodeId]: secondCustomNode
  },
  removeFirstCustomNode: { [secondCustomNodeId]: secondCustomNode }
};

describe('custom nodes reducer', () => {
  const actions = {
    addFirstCustomNode: addCustomNode({ id: firstCustomNodeId, config: firstCustomNode }),
    addSecondCustomNode: addCustomNode({ id: secondCustomNodeId, config: secondCustomNode }),
    removeFirstCustomNode: removeCustomNode({ id: firstCustomNodeId })
  };

  it('should return the initial state', () =>
    expect(customNodesReducer(undefined, {} as any)).toEqual({}));

  it('should handle adding the first custom node', () =>
    expect(
      customNodesReducer(customNodesExpectedState.initialState, actions.addFirstCustomNode)
    ).toEqual(customNodesExpectedState.addFirstCustomNode));
  it('should handle adding a second custom node', () =>
    expect(
      customNodesReducer(customNodesExpectedState.addFirstCustomNode, actions.addSecondCustomNode)
    ).toEqual(customNodesExpectedState.addSecondCustomNode));
  it('should handle removing the first custom node', () =>
    expect(
      customNodesReducer(
        customNodesExpectedState.addSecondCustomNode,
        actions.removeFirstCustomNode
      )
    ).toEqual(customNodesExpectedState.removeFirstCustomNode));
});
