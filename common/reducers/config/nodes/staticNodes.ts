import { EtherscanNode, InfuraNode, RPCNode } from 'libs/nodes';
import { TypeKeys, NodeAction } from 'actions/config';
import { NonWeb3NodeConfigs, Web3NodeConfigs } from 'types/node';

export type State = NonWeb3NodeConfigs & Web3NodeConfigs;

export const INITIAL_STATE: State = {
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
    lib: new InfuraNode('https://mainnet.infura.io/mew'),
    estimateGas: false
  },
  rop_infura: {
    network: 'Ropsten',
    isCustom: false,
    service: 'infura.io',
    lib: new InfuraNode('https://ropsten.infura.io/mew'),
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
    lib: new InfuraNode('https://rinkeby.infura.io/mew'),
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

export const staticNodes = (state: State = INITIAL_STATE, action: NodeAction) => {
  switch (action.type) {
    case TypeKeys.CONFIG_NODE_WEB3_SET:
      return { ...state, [action.payload.id]: action.payload.config };
    case TypeKeys.CONFIG_NODE_WEB3_UNSET:
      const stateCopy = { ...state };
      Reflect.deleteProperty(stateCopy, 'web3');
      return stateCopy;
    default:
      return state;
  }
};
