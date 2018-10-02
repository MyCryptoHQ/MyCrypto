import { CustomNodeConfig } from 'types/node';
import * as actions from './actions';
import { customNodesReducer } from './reducer';

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

const actionsToDispatch = {
  addFirstCustomNode: actions.addCustomNode(firstCustomNode),
  addSecondCustomNode: actions.addCustomNode(secondCustomNode),
  removeFirstCustomNode: actions.removeCustomNode(firstCustomNode.id)
};

describe('custom nodes reducer', () => {
  it('should return the initial state', () =>
    expect(customNodesReducer(undefined, {} as any)).toEqual({}));

  it('should handle adding the first custom node', () =>
    expect(
      customNodesReducer(expectedState.initialState, actionsToDispatch.addFirstCustomNode)
    ).toEqual(expectedState.addFirstCustomNode));
  it('should handle adding a second custom node', () =>
    expect(
      customNodesReducer(expectedState.addFirstCustomNode, actionsToDispatch.addSecondCustomNode)
    ).toEqual(expectedState.addSecondCustomNode));
  it('should handle removing the first custom node', () =>
    expect(
      customNodesReducer(expectedState.addSecondCustomNode, actionsToDispatch.removeFirstCustomNode)
    ).toEqual(expectedState.removeFirstCustomNode));
});

export { actions as customNodesActions, expectedState as customNodesExpectedState };
