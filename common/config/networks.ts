import { ethPlorer, ETHTokenExplorer, SecureWalletName, InsecureWalletName } from './data';
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
  UBQ_DEFAULT,
  DPath
} from 'config/dpaths';

export interface BlockExplorerConfig {
  origin: string;
  txUrl(txHash: string): string;
  addressUrl(address: string): string;
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
  mnemonicPhrase: DPath;
}

export interface NetworkConfig {
  // TODO really try not to allow strings due to custom networks
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
  dPathFormats: DPathFormats | null;
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
  network: string;
  auth?: {
    username: string;
    password: string;
  };
}

// Must be a website that follows the ethplorer convention of /tx/[hash] and
// address/[address] to generate the correct functions.
function makeExplorer(origin: string): BlockExplorerConfig {
  return {
    origin,
    txUrl: hash => `${origin}/tx/${hash}`,
    addressUrl: address => `${origin}/address/${address}`
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
    [SecureWalletName.TREZOR]: ETH_TREZOR,
    [SecureWalletName.LEDGER_NANO_S]: ETH_LEDGER,
    [InsecureWalletName.MNEMONIC_PHRASE]: ETH_DEFAULT
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
    [SecureWalletName.TREZOR]: ETH_TESTNET,
    [SecureWalletName.LEDGER_NANO_S]: ETH_TESTNET,
    [InsecureWalletName.MNEMONIC_PHRASE]: ETH_TESTNET
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
    [SecureWalletName.TREZOR]: ETH_TESTNET,
    [SecureWalletName.LEDGER_NANO_S]: ETH_TESTNET,
    [InsecureWalletName.MNEMONIC_PHRASE]: ETH_TESTNET
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
    [SecureWalletName.TREZOR]: ETH_TESTNET,
    [SecureWalletName.LEDGER_NANO_S]: ETH_TESTNET,
    [InsecureWalletName.MNEMONIC_PHRASE]: ETH_TESTNET
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
    [SecureWalletName.TREZOR]: ETC_TREZOR,
    [SecureWalletName.LEDGER_NANO_S]: ETC_LEDGER,
    [InsecureWalletName.MNEMONIC_PHRASE]: ETC_TREZOR
  }
};

const UBQ: NetworkConfig = {
  name: 'UBQ',
  unit: 'UBQ',
  chainId: 8,
  color: '#b37aff',
  blockExplorer: makeExplorer('https://ubiqscan.io/en'),
  tokens: require('./tokens/ubq.json'),
  contracts: require('./contracts/ubq.json'),
  dPathFormats: {
    [SecureWalletName.TREZOR]: UBQ_DEFAULT,
    [SecureWalletName.LEDGER_NANO_S]: UBQ_DEFAULT,
    [InsecureWalletName.MNEMONIC_PHRASE]: UBQ_DEFAULT
  }
};

const EXP: NetworkConfig = {
  name: 'EXP',
  unit: 'EXP',
  chainId: 2,
  color: '#673ab7',
  // tslint:disable:no-http-string - Unavailable behind HTTPS right now
  blockExplorer: makeExplorer('http://www.gander.tech'),
  // tslint:enable:no-http-string
  tokens: require('./tokens/exp.json'),
  contracts: require('./contracts/exp.json'),
  dPathFormats: {
    [SecureWalletName.TREZOR]: EXP_DEFAULT,
    [SecureWalletName.LEDGER_NANO_S]: EXP_DEFAULT,
    [InsecureWalletName.MNEMONIC_PHRASE]: EXP_DEFAULT
  }
};

export const NETWORKS = {
  ETH,
  Ropsten,
  Kovan,
  Rinkeby,
  ETC,
  UBQ,
  EXP
};

export type NetworkKeys = keyof typeof NETWORKS;

enum NodeName {
  ETH_MEW = 'eth_mew',
  ETH_MYCRYPTO = 'eth_mycrypto',
  ETH_ETHSCAN = 'eth_ethscan',
  ETH_INFURA = 'eth_infura',
  ROP_MEW = 'rop_mew',
  ROP_INFURA = 'rop_infura',
  KOV_ETHSCAN = 'kov_ethscan',
  RIN_ETHSCAN = 'rin_ethscan',
  RIN_INFURA = 'rin_infura',
  ETC_EPOOL = 'etc_epool',
  UBQ = 'ubq',
  EXP_TECH = 'exp_tech'
}

type NonWeb3NodeConfigs = { [key in NodeName]: NodeConfig };

interface Web3NodeConfig {
  web3?: NodeConfig;
}

type NodeConfigs = NonWeb3NodeConfigs & Web3NodeConfig;

export const NODES: NodeConfigs = {
  eth_mew: {
    network: 'ETH',
    lib: new RPCNode('https://api.myetherapi.com/eth'),
    service: 'MyEtherWallet',
    estimateGas: true
  },
  eth_mycrypto: {
    network: 'ETH',
    lib: new RPCNode('https://api.mycryptoapi.com/eth'),
    service: 'MyCrypto',
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
  },
  ubq: {
    network: 'UBQ',
    service: 'ubiqscan.io',
    lib: new RPCNode('https://pyrus2.ubiqscan.io'),
    estimateGas: true
  },
  exp_tech: {
    network: 'EXP',
    service: 'Expanse.tech',
    lib: new RPCNode('https://node.expanse.tech/'),
    estimateGas: true
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
      'Web3 not found. Please check that MetaMask is installed, or that MyCrypto is open in Mist.'
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

export const Web3Service = 'MetaMask / Mist';

export interface NodeConfigOverride extends NodeConfig {
  network: any;
}

export async function initWeb3Node(): Promise<void> {
  const { networkId, lib } = await setupWeb3Node();
  const web3: NodeConfigOverride = {
    network: networkIdToName(networkId),
    service: Web3Service,
    lib,
    estimateGas: false,
    hidden: true
  };

  NODES.web3 = web3;
}
