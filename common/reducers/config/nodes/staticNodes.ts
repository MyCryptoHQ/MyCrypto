import { TypeKeys, NodeAction } from 'actions/config';
import { StaticNodesState as State } from './types';
import { shepherdProvider } from 'libs/nodes';

export const INITIAL_STATE: State = {
  eth_mycrypto: {
    network: 'ETH',
    isCustom: false,
    lib: shepherdProvider,
    service: 'MyCrypto',
    estimateGas: true
  },
  eth_ethscan: {
    network: 'ETH',
    isCustom: false,
    service: 'Etherscan.io',
    lib: shepherdProvider,
    estimateGas: false
  },
  eth_infura: {
    network: 'ETH',
    isCustom: false,
    service: 'infura.io',
    lib: shepherdProvider,
    estimateGas: false
  },
  eth_blockscale: {
    network: 'ETH',
    isCustom: false,
    lib: shepherdProvider,
    service: 'Blockscale beta',
    estimateGas: true
  },
  rop_infura: {
    network: 'Ropsten',
    isCustom: false,
    service: 'infura.io',
    lib: shepherdProvider,
    estimateGas: false
  },
  kov_ethscan: {
    network: 'Kovan',
    isCustom: false,
    service: 'Etherscan.io',
    lib: shepherdProvider,
    estimateGas: false
  },
  rin_ethscan: {
    network: 'Rinkeby',
    isCustom: false,
    service: 'Etherscan.io',
    lib: shepherdProvider,
    estimateGas: false
  },
  rin_infura: {
    network: 'Rinkeby',
    isCustom: false,
    service: 'infura.io',
    lib: shepherdProvider,
    estimateGas: false
  },
  etc_epool: {
    network: 'ETC',
    isCustom: false,
    service: 'Epool.io',
    lib: shepherdProvider,
    estimateGas: false
  },
  ubq: {
    network: 'UBQ',
    isCustom: false,
    service: 'ubiqscan.io',
    lib: shepherdProvider,
    estimateGas: true
  },
  exp_tech: {
    network: 'EXP',
    isCustom: false,
    service: 'Expanse.tech',
    lib: shepherdProvider,
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
