import { Web3Service } from 'libs/nodes/web3';
import { StaticNodeConfig } from 'types/node';
import configuredStore from 'features/store';
import * as actions from './actions';
import * as reducer from './reducer';

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
  initialState: reducer.staticNodesReducer(undefined, {} as any),
  setWeb3: { ...reducer.CONFIG_STATIC_NODES_INITIAL_STATE, [web3Id]: web3Node },
  unsetWeb3: { ...reducer.CONFIG_STATIC_NODES_INITIAL_STATE }
};

const actionsToDispatch = {
  web3SetNode: actions.web3SetNode({ id: web3Id, config: web3Node }),
  web3UnsetNode: actions.web3UnsetNode()
};

describe('static nodes reducer', () => {
  it('should handle setting the web3 node', () =>
    expect(
      reducer.staticNodesReducer(
        reducer.CONFIG_STATIC_NODES_INITIAL_STATE,
        actionsToDispatch.web3SetNode
      )
    ).toEqual(expectedState.setWeb3));

  it('should handle unsetting the web3 node', () =>
    expect(
      reducer.staticNodesReducer(expectedState.setWeb3, actionsToDispatch.web3UnsetNode)
    ).toEqual(expectedState.unsetWeb3));
});

export { actions as staticNodesActions, expectedState as staticNodesExpectedState };
