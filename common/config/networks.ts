import { ethPlorer, ETHTokenExplorer } from './data';
import { EtherscanNode, InfuraNode, RPCNode, Web3Node } from 'libs/nodes';
import { networkIdToName } from 'libs/values';
import {
  ETH_DEFAULT,
  ETH_TREZOR,
  ETH_LEDGER,
  ETC_LEDGER,
  ETC_TREZOR,
  ETH_TESTNET,
  EXP_DEFAULT,
  UBIQ_DEFAULT,
  DPath
} from 'config/dpaths';

export interface BlockExplorerConfig {
  name: NetworkKeys;
  tx(txHash: string): string;
  address(address: string): string;
}

export interface Token {
  address: string;
  symbol: string;
  decimal: number;
  error?: string | null;
}

export interface NetworkContract {
  name: NetworkKeys;
  address?: string;
  abi: string;
}

export interface DPathFormats {
  trezor: DPath;
  ledgerNanoS: DPath;
  mnemonicPhrase: DPath[];
}

export interface NetworkConfig {
  name: NetworkKeys;
  unit: string;
  color?: string;
  blockExplorer?: BlockExplorerConfig;
  tokenExplorer?: {
    name: string;
    address(address: string): string;
  };
  chainId: number;
  tokens: Token[];
  contracts: NetworkContract[] | null;
  dPathFormats: DPathFormats;
  isTestnet?: boolean;
}

export interface CustomNetworkConfig {
  name: string;
  unit: string;
  chainId: number;
}

export interface NodeConfig {
  network: NetworkKeys;
  lib: RPCNode | Web3Node;
  service: string;
  estimateGas?: boolean;
  hidden?: boolean;
}

export interface CustomNodeConfig {
  name: string;
  url: string;
  port: number;
  network: NetworkKeys;
  auth?: {
    username: string;
    password: string;
  };
}

// Must be a website that follows the ethplorer convention of /tx/[hash] and
// address/[address] to generate the correct functions.
function makeExplorer(url): BlockExplorerConfig {
  return {
    name: url,
    tx: hash => `${url}/tx/${hash}`,
    address: address => `${url}/address/${address}`
  };
}

const ETH: NetworkConfig = {
  name: 'ETH',
  unit: 'ETH',
  chainId: 1,
  color: '#0e97c0',
  blockExplorer: makeExplorer('https://etherscan.io'),
  tokenExplorer: {
    name: ethPlorer,
    address: ETHTokenExplorer
  },
  tokens: require('./tokens/eth.json'),
  contracts: require('./contracts/eth.json'),
  dPathFormats: {
    trezor: ETH_TREZOR,
    ledgerNanoS: ETH_LEDGER,
    mnemonicPhrase: [ETH_DEFAULT, ETH_LEDGER, ETH_TREZOR]
  }
};

const Ropsten: NetworkConfig = {
  name: 'Ropsten',
  unit: 'ETH',
  chainId: 3,
  color: '#adc101',
  blockExplorer: makeExplorer('https://ropsten.etherscan.io'),
  tokens: require('./tokens/ropsten.json'),
  contracts: require('./contracts/ropsten.json'),
  isTestnet: true,
  dPathFormats: {
    trezor: ETH_TESTNET,
    ledgerNanoS: ETH_TESTNET,
    mnemonicPhrase: [ETH_TESTNET]
  }
};

const Kovan: NetworkConfig = {
  name: 'Kovan',
  unit: 'ETH',
  chainId: 42,
  color: '#adc101',
  blockExplorer: makeExplorer('https://kovan.etherscan.io'),
  tokens: require('./tokens/ropsten.json'),
  contracts: require('./contracts/ropsten.json'),
  isTestnet: true,
  dPathFormats: {
    trezor: ETH_TESTNET,
    ledgerNanoS: ETH_TESTNET,
    mnemonicPhrase: [ETH_TESTNET]
  }
};

const Rinkeby: NetworkConfig = {
  name: 'Rinkeby',
  unit: 'ETH',
  chainId: 4,
  color: '#adc101',
  blockExplorer: makeExplorer('https://rinkeby.etherscan.io'),
  tokens: require('./tokens/rinkeby.json'),
  contracts: require('./contracts/rinkeby.json'),
  isTestnet: true,
  dPathFormats: {
    trezor: ETH_TESTNET,
    ledgerNanoS: ETH_TESTNET,
    mnemonicPhrase: [ETH_TESTNET]
  }
};

const ETC: NetworkConfig = {
  name: 'ETC',
  unit: 'ETC',
  chainId: 61,
  color: '#669073',
  blockExplorer: makeExplorer('https://gastracker.io'),
  tokens: require('./tokens/etc.json'),
  contracts: require('./contracts/etc.json'),
  dPathFormats: {
    trezor: ETC_TREZOR,
    ledgerNanoS: ETC_LEDGER,
    mnemonicPhrase: [ETC_TREZOR, ETC_LEDGER]
  }
};

export type NetworkKeys = keyof typeof NETWORKS;
export const NETWORKS = {
  ETH,
  Ropsten,
  Kovan,
  Rinkeby,
  ETC
};

export const NODES: { [key: string]: NodeConfig } = {
  eth_mew: {
    network: 'ETH',
    lib: new RPCNode('https://api.myetherapi.com/eth'),
    service: 'MyEtherWallet',
    estimateGas: true
  },
  eth_ethscan: {
    network: 'ETH',
    service: 'Etherscan.io',
    lib: new EtherscanNode('https://api.etherscan.io/api'),
    estimateGas: false
  },
  eth_infura: {
    network: 'ETH',
    service: 'infura.io',
    lib: new InfuraNode('https://mainnet.infura.io/mew'),
    estimateGas: false
  },
  rop_mew: {
    network: 'Ropsten',
    service: 'MyEtherWallet',
    lib: new RPCNode('https://api.myetherapi.com/rop'),
    estimateGas: false
  },
  rop_infura: {
    network: 'Ropsten',
    service: 'infura.io',
    lib: new InfuraNode('https://ropsten.infura.io/mew'),
    estimateGas: false
  },
  kov_ethscan: {
    network: 'Kovan',
    service: 'Etherscan.io',
    lib: new EtherscanNode('https://kovan.etherscan.io/api'),
    estimateGas: false
  },
  rin_ethscan: {
    network: 'Rinkeby',
    service: 'Etherscan.io',
    lib: new EtherscanNode('https://rinkeby.etherscan.io/api'),
    estimateGas: false
  },
  rin_infura: {
    network: 'Rinkeby',
    service: 'infura.io',
    lib: new InfuraNode('https://rinkeby.infura.io/mew'),
    estimateGas: false
  },
  etc_epool: {
    network: 'ETC',
    service: 'Epool.io',
    lib: new RPCNode('https://mewapi.epool.io'),
    estimateGas: false
  }
};

interface Web3NodeInfo {
  networkId: string;
  lib: Web3Node;
}

export async function setupWeb3Node(): Promise<Web3NodeInfo> {
  const { web3 } = window as any;

  if (!web3 || !web3.currentProvider || !web3.currentProvider.sendAsync) {
    throw new Error(
      'Web3 not found. Please check that MetaMask is installed, or that MyEtherWallet is open in Mist.'
    );
  }

  const lib = new Web3Node();
  const networkId = await lib.getNetVersion();
  const accounts = await lib.getAccounts();

  if (!accounts.length) {
    throw new Error('No accounts found in MetaMask / Mist.');
  }

  if (networkId === 'loading') {
    throw new Error('MetaMask / Mist is still loading. Please refresh the page and try again.');
  }

  return { networkId, lib };
}

export async function isWeb3NodeAvailable(): Promise<boolean> {
  try {
    await setupWeb3Node();
    return true;
  } catch (e) {
    return false;
  }
}

export async function initWeb3Node(): Promise<void> {
  const { networkId, lib } = await setupWeb3Node();
  NODES.web3 = {
    network: networkIdToName(networkId),
    service: 'MetaMask / Mist',
    lib,
    estimateGas: false,
    hidden: true
  };
}
