import { EtherscanNode, InfuraNode, RPCNode, Web3Node } from 'libs/nodes';
import { networkIdToName } from 'libs/values';

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

export interface NodeConfig {
  network: NetworkKeys;
  lib: RPCNode | Web3Node;
  service: string;
  estimateGas?: boolean;
  hidden?: boolean;
}

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
