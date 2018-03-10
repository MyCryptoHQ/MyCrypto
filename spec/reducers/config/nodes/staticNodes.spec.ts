import { configuredStore } from 'store';
import { web3SetNode, web3UnsetNode } from 'actions/config';
import { staticNodes, INITIAL_STATE } from 'reducers/config/nodes/staticNodes';
import { EtherscanNode, InfuraNode, RPCNode } from 'libs/nodes';
import { Web3NodeConfig } from 'types/node';
import { Web3Service } from 'libs/nodes/web3';
configuredStore.getState();

const expectedInitialState = {
  eth_mycrypto: {
    network: 'ETH',
    isCustom: false,
    lib: new RPCNode('https://api.mycryptoapi.com/eth'),
    service: 'MyCrypto',
    estimateGas: true
  },
  eth_ethscan: {
    network: 'ETH',
    isCustom: false,
    service: 'Etherscan.io',
    lib: new EtherscanNode('https://api.etherscan.io/api'),
    estimateGas: false
  },
  eth_infura: {
    network: 'ETH',
    isCustom: false,
    service: 'infura.io',
    lib: new InfuraNode('https://mainnet.infura.io/mycrypto'),
    estimateGas: false
  },
  eth_blockscale: {
    network: 'ETH',
    isCustom: false,
    lib: new RPCNode('https://api.dev.blockscale.net/dev/parity'),
    service: 'Blockscale beta',
    estimateGas: true
  },
  rop_infura: {
    network: 'Ropsten',
    isCustom: false,
    service: 'infura.io',
    lib: new InfuraNode('https://ropsten.infura.io/mycrypto'),
    estimateGas: false
  },
  kov_ethscan: {
    network: 'Kovan',
    isCustom: false,
    service: 'Etherscan.io',
    lib: new EtherscanNode('https://kovan.etherscan.io/api'),
    estimateGas: false
  },
  rin_ethscan: {
    network: 'Rinkeby',
    isCustom: false,
    service: 'Etherscan.io',
    lib: new EtherscanNode('https://rinkeby.etherscan.io/api'),
    estimateGas: false
  },
  rin_infura: {
    network: 'Rinkeby',
    isCustom: false,
    service: 'infura.io',
    lib: new InfuraNode('https://rinkeby.infura.io/mycrypto'),
    estimateGas: false
  },
  etc_epool: {
    network: 'ETC',
    isCustom: false,
    service: 'Epool.io',
    lib: new RPCNode('https://mewapi.epool.io'),
    estimateGas: false
  },
  ubq: {
    network: 'UBQ',
    isCustom: false,
    service: 'ubiqscan.io',
    lib: new RPCNode('https://pyrus2.ubiqscan.io'),
    estimateGas: true
  },
  exp_tech: {
    network: 'EXP',
    isCustom: false,
    service: 'Expanse.tech',
    lib: new RPCNode('https://node.expanse.tech/'),
    estimateGas: true
  }
};

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
  initialState: expectedInitialState,
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
