import { StaticNodeConfig } from 'types/node';
import { Web3Service } from 'libs/nodes/web3';
import { web3SetNode, web3UnsetNode } from '../../actions';
import staticNodes, { STATIC_NODES_INITIAL_STATE } from './reducers';

const web3Id = 'web3';
const web3Node: StaticNodeConfig = {
  isCustom: false,
  network: 'ETH',
  service: Web3Service,
  lib: jest.fn() as any,
  estimateGas: false,
  hidden: true
};

export const staticNodesExpectedState = {
  initialState: staticNodes(undefined, {} as any),
  setWeb3: { ...STATIC_NODES_INITIAL_STATE, [web3Id]: web3Node },
  unsetWeb3: { ...STATIC_NODES_INITIAL_STATE }
};

describe('static nodes reducer', () => {
  const actions = {
    web3SetNode: web3SetNode({ id: web3Id, config: web3Node }),
    web3UnsetNode: web3UnsetNode()
  };

  it('should handle setting the web3 node', () =>
    expect(staticNodes(STATIC_NODES_INITIAL_STATE, actions.web3SetNode)).toEqual(
      staticNodesExpectedState.setWeb3
    ));

  it('should handle unsetting the web3 node', () =>
    expect(staticNodes(staticNodesExpectedState.setWeb3, actions.web3UnsetNode)).toEqual(
      staticNodesExpectedState.unsetWeb3
    ));
});
