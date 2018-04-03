import { configuredStore } from 'store';
import { web3SetNode, web3UnsetNode } from 'actions/config';
import { staticNodes, INITIAL_STATE } from 'reducers/config/nodes/staticNodes';
import { Web3Service } from 'libs/nodes/web3';
configuredStore.getState();

const expectedInitialState = {
  eth_mycrypto: {
    network: 'ETH',
    isCustom: false,
    lib: {},
    service: 'MyCrypto',
    estimateGas: true
  },
  eth_ethscan: {
    network: 'ETH',
    isCustom: false,
    service: 'Etherscan.io',
    lib: {},
    estimateGas: false
  },
  eth_infura: {
    network: 'ETH',
    isCustom: false,
    service: 'infura.io',
    lib: {},
    estimateGas: false
  },
  eth_blockscale: {
    network: 'ETH',
    isCustom: false,
    lib: {},
    service: 'Blockscale beta',
    estimateGas: true
  },
  rop_infura: {
    network: 'Ropsten',
    isCustom: false,
    service: 'infura.io',
    lib: {},
    estimateGas: false
  },
  kov_ethscan: {
    network: 'Kovan',
    isCustom: false,
    service: 'Etherscan.io',
    lib: {},
    estimateGas: false
  },
  rin_ethscan: {
    network: 'Rinkeby',
    isCustom: false,
    service: 'Etherscan.io',
    lib: {},
    estimateGas: false
  },
  rin_infura: {
    network: 'Rinkeby',
    isCustom: false,
    service: 'infura.io',
    lib: {},
    estimateGas: false
  },
  etc_epool: {
    network: 'ETC',
    isCustom: false,
    service: 'Epool.io',
    lib: {},
    estimateGas: false
  },
  ubq: {
    network: 'UBQ',
    isCustom: false,
    service: 'ubiqscan.io',
    lib: {},
    estimateGas: true
  },
  exp_tech: {
    network: 'EXP',
    isCustom: false,
    service: 'Expanse.tech',
    lib: {},
    estimateGas: true
  }
};

const web3Id = 'web3';
const web3Node = {
  isCustom: false,
  network: 'ETH',
  service: Web3Service,
  lib: jest.fn() as any,
  estimateGas: false,
  hidden: true
};

const expectedState = {
  initialState: expectedInitialState,
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
