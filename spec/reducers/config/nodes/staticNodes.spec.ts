import { configuredStore } from 'store';
import { web3SetNode, web3UnsetNode } from 'actions/config';
import { staticNodes, INITIAL_STATE } from 'reducers/config/nodes/staticNodes';
import { Web3NodeConfig } from 'types/node';
import { Web3Service } from 'libs/nodes/web3';
configuredStore.getState();

const web3Id = 'web3';
const web3Node: Web3NodeConfig = {
  isCustom: false,
  network: 'ETH',
  service: Web3Service,
  lib: jest.fn() as any,
  estimateGas: false,
  hidden: true
};

const expectedState = {
  initialState: staticNodes(undefined, {} as any),
  setWeb3: { ...INITIAL_STATE, [web3Id]: web3Node },
  unsetWeb3: { ...INITIAL_STATE }
};

const actions = {
  web3SetNode: web3SetNode({ id: web3Id, config: web3Node }),
  web3UnsetNode: web3UnsetNode()
};

describe('static nodes reducer', () => {
  it('should return the inital state', () =>
    // turn the JSON into a string because we're storing function in the state
    expect(JSON.stringify(staticNodes(undefined, {} as any))).toEqual(
      JSON.stringify(expectedState.initialState)
    ));
  it('should handle setting the web3 node', () =>
    expect(staticNodes(INITIAL_STATE, actions.web3SetNode)).toEqual(expectedState.setWeb3));

  it('should handle unsetting the web3 node', () =>
    expect(staticNodes(expectedState.setWeb3, actions.web3UnsetNode)).toEqual(
      expectedState.unsetWeb3
    ));
});

export { actions as staticNodesActions, expectedState as staticNodesExpectedState };
