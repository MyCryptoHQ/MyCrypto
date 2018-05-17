import { combineReducers } from 'redux';

import { shepherdProvider } from 'libs/nodes';
import {
  ethPlorer,
  ETHTokenExplorer,
  gasPriceDefaults,
  InsecureWalletName,
  SecureWalletName
} from 'config/data';
import {
  ELLA_DEFAULT,
  ETC_LEDGER,
  ETC_TREZOR,
  ETH_DEFAULT,
  ETH_LEDGER,
  ETH_TESTNET,
  ETH_TREZOR,
  EXP_DEFAULT,
  POA_DEFAULT,
  TOMO_DEFAULT,
  UBQ_DEFAULT
} from 'config/dpaths';
import { makeExplorer } from 'utils/helpers';
import {
  TypeKeys,
  ChangeLanguageAction,
  SetLatestBlockAction,
  MetaAction,
  CustomNetworksState,
  StaticNetworksState,
  AddCustomNetworkAction,
  RemoveCustomNetworkAction,
  CustomNetworkAction,
  ConfigAction,
  CustomNodeAction,
  AddCustomNodeAction,
  RemoveCustomNodeAction,
  CustomNodesState,
  NodeAction,
  StaticNodesState,
  ChangeNodeAction,
  ChangeNodeIntentAction,
  SelectedNodeState
} from './types';

//#region Meta
interface MetaState {
  languageSelection: string;
  offline: boolean;
  autoGasLimit: boolean;
  latestBlock: string;
}

const META_INITIAL_STATE: MetaState = {
  languageSelection: 'en',
  offline: false,
  autoGasLimit: true,
  latestBlock: '???'
};

function changeLanguage(state: MetaState, action: ChangeLanguageAction): MetaState {
  return {
    ...state,
    languageSelection: action.payload
  };
}

function setOnline(state: MetaState): MetaState {
  return {
    ...state,
    offline: false
  };
}

function setOffline(state: MetaState): MetaState {
  return {
    ...state,
    offline: true
  };
}

function toggleAutoGasLimitEstimation(state: MetaState): MetaState {
  return {
    ...state,
    autoGasLimit: !state.autoGasLimit
  };
}

function setLatestBlock(state: MetaState, action: SetLatestBlockAction): MetaState {
  return {
    ...state,
    latestBlock: action.payload
  };
}

export function meta(state: MetaState = META_INITIAL_STATE, action: MetaAction): MetaState {
  switch (action.type) {
    case TypeKeys.CONFIG_LANGUAGE_CHANGE:
      return changeLanguage(state, action);

    case TypeKeys.CONFIG_SET_ONLINE:
      return setOnline(state);
    case TypeKeys.CONFIG_SET_OFFLINE:
      return setOffline(state);

    case TypeKeys.CONFIG_TOGGLE_AUTO_GAS_LIMIT:
      return toggleAutoGasLimitEstimation(state);

    case TypeKeys.CONFIG_SET_LATEST_BLOCK:
      return setLatestBlock(state, action);
    default:
      return state;
  }
}
//#endregion Meta

//#region Networks

//#region Custom Networks
const addCustomNetwork = (
  state: CustomNetworksState,
  { payload }: AddCustomNetworkAction
): CustomNetworksState => ({
  ...state,
  [payload.id]: payload.config
});

function removeCustomNetwork(
  state: CustomNetworksState,
  { payload }: RemoveCustomNetworkAction
): CustomNetworksState {
  const stateCopy = { ...state };
  Reflect.deleteProperty(stateCopy, payload.id);
  return stateCopy;
}

export const customNetworks = (state: CustomNetworksState = {}, action: CustomNetworkAction) => {
  switch (action.type) {
    case TypeKeys.CONFIG_ADD_CUSTOM_NETWORK:
      return addCustomNetwork(state, action);
    case TypeKeys.CONFIG_REMOVE_CUSTOM_NETWORK:
      return removeCustomNetwork(state, action);
    default:
      return state;
  }
};
//#endregion Custom Networks

//#region Static Networks
const testnetDefaultGasPrice = {
  min: 0.1,
  max: 40,
  initial: 4
};

export const STATIC_NETWORKS_INITIAL_STATE: StaticNetworksState = {
  ETH: {
    name: 'ETH',
    unit: 'ETH',
    chainId: 1,
    isCustom: false,
    color: '#007896',
    blockExplorer: makeExplorer({
      name: 'Etherscan',
      origin: 'https://etherscan.io'
    }),
    tokenExplorer: {
      name: ethPlorer,
      address: ETHTokenExplorer
    },
    tokens: require('config/tokens/eth.json'),
    contracts: require('config/contracts/eth.json'),
    dPathFormats: {
      [SecureWalletName.TREZOR]: ETH_TREZOR,
      [SecureWalletName.LEDGER_NANO_S]: ETH_LEDGER,
      [InsecureWalletName.MNEMONIC_PHRASE]: ETH_DEFAULT
    },
    gasPriceSettings: gasPriceDefaults,
    shouldEstimateGasPrice: true
  },
  Ropsten: {
    name: 'Ropsten',
    unit: 'ETH',
    chainId: 3,
    isCustom: false,
    color: '#adc101',
    blockExplorer: makeExplorer({
      name: 'Etherscan',
      origin: 'https://ropsten.etherscan.io'
    }),
    tokens: require('config/tokens/ropsten.json'),
    contracts: require('config/contracts/ropsten.json'),
    isTestnet: true,
    dPathFormats: {
      [SecureWalletName.TREZOR]: ETH_TESTNET,
      [SecureWalletName.LEDGER_NANO_S]: ETH_LEDGER,
      [InsecureWalletName.MNEMONIC_PHRASE]: ETH_TESTNET
    },
    gasPriceSettings: testnetDefaultGasPrice
  },
  Kovan: {
    name: 'Kovan',
    unit: 'ETH',
    chainId: 42,
    isCustom: false,
    color: '#adc101',
    blockExplorer: makeExplorer({
      name: 'Etherscan',
      origin: 'https://kovan.etherscan.io'
    }),
    tokens: require('config/tokens/ropsten.json'),
    contracts: require('config/contracts/ropsten.json'),
    isTestnet: true,
    dPathFormats: {
      [SecureWalletName.TREZOR]: ETH_TESTNET,
      [SecureWalletName.LEDGER_NANO_S]: ETH_LEDGER,
      [InsecureWalletName.MNEMONIC_PHRASE]: ETH_TESTNET
    },
    gasPriceSettings: testnetDefaultGasPrice
  },
  Rinkeby: {
    name: 'Rinkeby',
    unit: 'ETH',
    chainId: 4,
    isCustom: false,
    color: '#adc101',
    blockExplorer: makeExplorer({
      name: 'Etherscan',
      origin: 'https://rinkeby.etherscan.io'
    }),
    tokens: require('config/tokens/rinkeby.json'),
    contracts: require('config/contracts/rinkeby.json'),
    isTestnet: true,
    dPathFormats: {
      [SecureWalletName.TREZOR]: ETH_TESTNET,
      [SecureWalletName.LEDGER_NANO_S]: ETH_LEDGER,
      [InsecureWalletName.MNEMONIC_PHRASE]: ETH_TESTNET
    },
    gasPriceSettings: testnetDefaultGasPrice
  },
  ETC: {
    name: 'ETC',
    unit: 'ETC',
    chainId: 61,
    isCustom: false,
    color: '#669073',
    blockExplorer: makeExplorer({
      name: 'GasTracker',
      origin: 'https://gastracker.io',
      addressPath: 'addr'
    }),
    tokens: require('config/tokens/etc.json'),
    contracts: require('config/contracts/etc.json'),
    dPathFormats: {
      [SecureWalletName.TREZOR]: ETC_TREZOR,
      [SecureWalletName.LEDGER_NANO_S]: ETC_LEDGER,
      [InsecureWalletName.MNEMONIC_PHRASE]: ETC_TREZOR
    },
    gasPriceSettings: {
      min: 0.1,
      max: 10,
      initial: 1
    }
  },
  UBQ: {
    name: 'UBQ',
    unit: 'UBQ',
    chainId: 8,
    isCustom: false,
    color: '#b37aff',
    blockExplorer: makeExplorer({
      name: 'Ubiqscan',
      origin: 'https://ubiqscan.io/en'
    }),
    tokens: require('config/tokens/ubq.json'),
    contracts: require('config/contracts/ubq.json'),
    dPathFormats: {
      [SecureWalletName.TREZOR]: UBQ_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: UBQ_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: UBQ_DEFAULT
    },
    gasPriceSettings: {
      min: 1,
      max: 60,
      initial: 20
    }
  },
  EXP: {
    name: 'EXP',
    unit: 'EXP',
    chainId: 2,
    isCustom: false,
    color: '#673ab7',
    blockExplorer: makeExplorer({
      name: 'Gander',
      origin: 'https://www.gander.tech'
    }),
    tokens: require('config/tokens/exp.json'),
    contracts: require('config/contracts/exp.json'),
    dPathFormats: {
      [SecureWalletName.TREZOR]: EXP_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: EXP_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: EXP_DEFAULT
    },
    gasPriceSettings: {
      min: 0.1,
      max: 20,
      initial: 2
    }
  },
  POA: {
    name: 'POA',
    unit: 'POA',
    chainId: 99,
    isCustom: false,
    color: '#6d2eae',
    blockExplorer: makeExplorer({
      name: 'Etherchain Light',
      origin: 'https://poaexplorer.com',
      addressPath: 'address/search',
      blockPath: 'blocks/block'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: POA_DEFAULT,
      [SecureWalletName.LEDGER_NANO_S]: ETH_LEDGER,
      [InsecureWalletName.MNEMONIC_PHRASE]: POA_DEFAULT
    },
    gasPriceSettings: {
      min: 0.1,
      max: 10,
      initial: 1
    }
  },
  TOMO: {
    name: 'TOMO',
    unit: 'TOMO',
    chainId: 40686,
    isCustom: false,
    color: '#6a488d',
    blockExplorer: makeExplorer({
      name: 'Tomochain Explorer',
      origin: 'https://explorer.tomocoin.io/#'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.LEDGER_NANO_S]: ETH_LEDGER,
      [SecureWalletName.TREZOR]: ETH_TREZOR,
      [SecureWalletName.LEDGER_NANO_S]: TOMO_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: TOMO_DEFAULT
    },
    gasPriceSettings: {
      min: 1,
      max: 60,
      initial: 20
    }
  },
  ELLA: {
    name: 'ELLA',
    unit: 'ELLA',
    chainId: 64,
    isCustom: false,
    color: '#046111',
    blockExplorer: makeExplorer({
      name: 'Ellaism Explorer',
      origin: 'https://explorer.ellaism.org'
    }),
    tokens: [],
    contracts: [],
    dPathFormats: {
      [SecureWalletName.TREZOR]: ELLA_DEFAULT,
      [InsecureWalletName.MNEMONIC_PHRASE]: ELLA_DEFAULT
    },
    gasPriceSettings: {
      min: 1,
      max: 60,
      initial: 20
    }
  }
};

export const staticNetworks = (
  state: StaticNetworksState = STATIC_NETWORKS_INITIAL_STATE,
  action: ConfigAction
) => {
  switch (action.type) {
    default:
      return state;
  }
};

//#endregion Static Networks

interface NetworksState {
  customNetworks: CustomNetworksState;
  staticNetworks: StaticNetworksState;
}

const networks = combineReducers<NetworksState>({
  customNetworks,
  staticNetworks
});
//#endregion Networks

//#region Nodes

//#region Custom Nodes
const addCustomNode = (
  state: CustomNodesState,
  { payload }: AddCustomNodeAction
): CustomNodesState => ({
  ...state,
  [payload.id]: payload.config
});

function removeCustomNode(
  state: CustomNodesState,
  { payload }: RemoveCustomNodeAction
): CustomNodesState {
  const stateCopy = { ...state };
  Reflect.deleteProperty(stateCopy, payload.id);
  return stateCopy;
}

export const customNodes = (
  state: CustomNodesState = {},
  action: CustomNodeAction
): CustomNodesState => {
  switch (action.type) {
    case TypeKeys.CONFIG_ADD_CUSTOM_NODE:
      return addCustomNode(state, action);
    case TypeKeys.CONFIG_REMOVE_CUSTOM_NODE:
      return removeCustomNode(state, action);
    default:
      return state;
  }
};
//#endregion Custom Nodes

//#region Static Nodes
export const STATIC_NODES_INITIAL_STATE: StaticNodesState = {
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

export const staticNodes = (
  state: StaticNodesState = STATIC_NODES_INITIAL_STATE,
  action: NodeAction
) => {
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
//#endregion Static Nodes

//#region Selected Node
export const SELECTED_NODE_INITIAL_STATE: SelectedNodeState = {
  nodeId: 'eth_auto',
  prevNode: 'eth_auto',
  pending: false
};

const changeNode = (
  state: SelectedNodeState,
  { payload }: ChangeNodeAction
): SelectedNodeState => ({
  nodeId: payload.nodeId,
  // make sure we dont accidentally switch back to a web3 node
  prevNode: state.nodeId === 'web3' ? state.prevNode : state.nodeId,
  pending: false
});

const changeNodeIntent = (
  state: SelectedNodeState,
  _: ChangeNodeIntentAction
): SelectedNodeState => ({
  ...state,
  pending: true
});

const handleRemoveCustomNode = (
  _: SelectedNodeState,
  _1: RemoveCustomNodeAction
): SelectedNodeState => SELECTED_NODE_INITIAL_STATE;

export const selectedNode = (
  state: SelectedNodeState = SELECTED_NODE_INITIAL_STATE,
  action: NodeAction | CustomNodeAction
) => {
  switch (action.type) {
    case TypeKeys.CONFIG_NODE_CHANGE:
      return changeNode(state, action);
    case TypeKeys.CONFIG_NODE_CHANGE_INTENT:
      return changeNodeIntent(state, action);
    case TypeKeys.CONFIG_REMOVE_CUSTOM_NODE:
      return handleRemoveCustomNode(state, action);
    default:
      return state;
  }
};

//#endregion Selected Node

interface NodesState {
  customNodes: CustomNodesState;
  staticNodes: StaticNodesState;
  selectedNode: SelectedNodeState;
}

const nodes = combineReducers<NodesState>({ customNodes, staticNodes, selectedNode });
//#endregion Nodes

export interface State {
  meta: MetaState;
  networks: NetworksState;
  nodes: NodesState;
}

export default combineReducers<State>({ meta, networks, nodes });
