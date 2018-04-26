import { TypeKeys, NodeAction } from 'actions/config';
import { shepherdProvider } from 'libs/nodes';
import { StaticNodesState } from './types';

export const INITIAL_STATE: StaticNodesState = {
  eth_auto: {
    network: 'ETH',
    isCustom: false,
    lib: shepherdProvider,
    service: 'AUTO',
    estimateGas: true
  },
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

  rop_auto: {
    network: 'Ropsten',
    isCustom: false,
    service: 'AUTO',
    lib: shepherdProvider,
    estimateGas: false
  },
  rop_infura: {
    network: 'Ropsten',
    isCustom: false,
    service: 'infura.io',
    lib: shepherdProvider,
    estimateGas: false
  },

  kov_auto: {
    network: 'Kovan',
    isCustom: false,
    service: 'AUTO',
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

  rin_auto: {
    network: 'Rinkeby',
    isCustom: false,
    service: 'AUTO',
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

  etc_auto: {
    network: 'ETC',
    isCustom: false,
    service: 'AUTO',
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
  etc_commonwealth: {
    network: 'ETC',
    isCustom: false,
    service: 'Ethereum Commonwealth',
    lib: shepherdProvider,
    estimateGas: false
  },

  ubq_auto: {
    network: 'UBQ',
    isCustom: false,
    service: 'AUTO',
    lib: shepherdProvider,
    estimateGas: true
  },
  ubq: {
    network: 'UBQ',
    isCustom: false,
    service: 'ubiqscan.io',
    lib: shepherdProvider,
    estimateGas: true
  },

  exp_auto: {
    network: 'EXP',
    isCustom: false,
    service: 'AUTO',
    lib: shepherdProvider,
    estimateGas: true
  },
  exp_tech: {
    network: 'EXP',
    isCustom: false,
    service: 'Expanse.tech',
    lib: shepherdProvider,
    estimateGas: true
  },
  poa_auto: {
    network: 'POA',
    isCustom: false,
    service: 'AUTO',
    lib: shepherdProvider,
    estimateGas: true
  },
  poa: {
    network: 'POA',
    isCustom: false,
    service: 'poa.network',
    lib: shepherdProvider,
    estimateGas: true
  },
  tomo_auto: {
    network: 'TOMO',
    isCustom: false,
    service: 'AUTO',
    lib: shepherdProvider,
    estimateGas: true
  },
  tomo: {
    network: 'TOMO',
    isCustom: false,
    service: 'tomocoin.io',
    lib: shepherdProvider,
    estimateGas: true
  },
  ella_auto: {
    network: 'ELLA',
    isCustom: false,
    service: 'AUTO',
    lib: shepherdProvider,
    estimateGas: true
  },
  ella: {
    network: 'ELLA',
    isCustom: false,
    service: 'ellaism.org',
    lib: shepherdProvider,
    estimateGas: true
  }
};

const staticNodes = (state: StaticNodesState = INITIAL_STATE, action: NodeAction) => {
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

export { StaticNodesState, staticNodes };
