import { configuredStore } from 'store';
import { web3SetNode, web3UnsetNode } from 'actions/config';
import { staticNodes, INITIAL_STATE } from 'reducers/config/nodes/staticNodes';
import { Web3Service } from 'libs/nodes/web3';
import { StaticNodeConfig } from 'types/node';
configuredStore.getState();

const web3Id = 'web3';
const web3Node: StaticNodeConfig = {
  id: web3Id,
  isCustom: false,
  network: 'ETH',
  service: Web3Service,
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
  it('should handle setting the web3 node', () =>
    expect(staticNodes(INITIAL_STATE, actions.web3SetNode)).toEqual(expectedState.setWeb3));

  it('should handle unsetting the web3 node', () =>
    expect(staticNodes(expectedState.setWeb3, actions.web3UnsetNode)).toEqual(
      expectedState.unsetWeb3
    ));
});

export { actions as staticNodesActions, expectedState as staticNodesExpectedState };
