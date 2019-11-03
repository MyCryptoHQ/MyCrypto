import { NodeType, NodeConfig, NetworkId } from 'v2/types';
import { INFURA_API_KEY } from './constants';

const makeNodeName = (network: string, name: string) => {
  return `${network.toLowerCase()}_${name}`;
};

export const NODES_CONFIG: { [key in NetworkId]: NodeConfig[] } = {
  Ethereum: [
    {
      name: makeNodeName('ETH', 'mycrypto'),
      type: NodeType.RPC,
      service: 'MyCrypto',
      url: 'https://api.mycryptoapi.com/eth'
    },
    {
      name: makeNodeName('ETH', 'ethscan'),
      type: NodeType.ETHERSCAN,
      service: 'Etherscan',
      url: 'https://api.etherscan.io/api'
    },
    {
      name: makeNodeName('ETH', 'infura'),
      type: NodeType.INFURA,
      service: 'Infura',
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`
    }
  ],

  Ropsten: [
    {
      name: makeNodeName('Ropsten', 'infura'),
      type: NodeType.INFURA,
      service: 'Infura',
      url: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`
    }
  ],

  Kovan: [
    {
      name: makeNodeName('Kovan', 'ethscan'),
      type: NodeType.ETHERSCAN,
      service: 'Etherscan',
      url: 'https://kovan.etherscan.io/api'
    }
  ],

  Rinkeby: [
    {
      name: makeNodeName('Rinkeby', 'infura'),
      type: NodeType.INFURA,
      service: 'Infura',
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`
    },
    {
      name: makeNodeName('Rinkeby', 'ethscan'),
      type: NodeType.ETHERSCAN,
      service: 'Etherscan',
      url: 'https://rinkeby.etherscan.io/api'
    }
  ],

  Goerli: [
    {
      name: makeNodeName('Goerli', 'mycrypto'),
      type: NodeType.RPC,
      service: 'MyCrypto',
      url: 'https://goerli.mycryptoapi.com'
    },
    {
      name: makeNodeName('Goerli', 'etherscan'),
      type: NodeType.ETHERSCAN,
      service: 'Etherscan',
      url: 'https://api-goerli.etherscan.io/api'
    }
  ],

  ETC: [
    {
      name: makeNodeName('ETC', 'etccooperative'),
      type: NodeType.RPC,
      service: 'ETC Cooperative',
      url: 'https://ethereumclassic.network'
    }
  ],

  RSK: [
    {
      name: makeNodeName('RSK', 'rsk_mainnet'),
      type: NodeType.RPC,
      service: 'mycrypto.rsk.co',
      url: 'https://mycrypto.rsk.co/'
    }
  ],

  AKA: [
    {
      name: makeNodeName('AKA', 'remote.akroma.io'),
      type: NodeType.RPC,
      service: 'remote.akroma.io',
      url: 'https://remote.akroma.io'
    },
    {
      name: makeNodeName('AKA', 'rpc.akroma.io'),
      type: NodeType.RPC,
      service: 'rpc.akroma.io',
      url: 'https://rpc.akroma.io'
    }
  ],

  AQUA: [
    {
      name: makeNodeName('AQUA', 'aquachain'),
      type: NodeType.RPC,
      service: 'aquacha.in',
      url: 'https://tx.aquacha.in/api'
    },
    {
      name: makeNodeName('AQUA', 'uncan.onical'),
      type: NodeType.RPC,
      service: 'uncan.onical.org',
      url: 'https://c.onical.org'
    }
  ],

  ASK: [
    {
      name: makeNodeName('ASK', 'permission'),
      type: NodeType.RPC,
      service: 'permission.io',
      url: 'https://blockchain-api-mainnet.permission.io/rpc'
    }
  ],

  ARTIS_SIGMA1: [
    {
      name: makeNodeName('ARTIS_SIGMA1', 'artis_sigma1'),
      type: NodeType.RPC,
      service: 'rpc.sigma1.artis.network',
      url: 'https://rpc.sigma1.artis.network'
    }
  ],

  ARTIS_TAU1: [
    {
      name: makeNodeName('ARTIS_TAU1', 'artis_tau1'),
      type: NodeType.RPC,
      service: 'rpc.tau1.artis.network',
      url: 'https://rpc.tau1.artis.network'
    }
  ],

  ATH: [
    {
      name: makeNodeName('ATH', 'wallet.atheios.com'),
      type: NodeType.RPC,
      service: 'wallet.atheios.com',
      url: 'https://wallet.atheios.com:8797'
    }
  ],

  CLO: [
    {
      name: makeNodeName('CLO', 'clo'),
      type: NodeType.RPC,
      service: '0xinfra.com',
      url: 'https://clo-geth.0xinfra.com/'
    },
    {
      name: makeNodeName('CLO', 'chainkorea'),
      type: NodeType.RPC,
      service: 'Chainkorea',
      url: 'https://node.clopool.net/'
    }
  ],

  DEXON: [
    {
      name: makeNodeName('DEXON', 'dexon'),
      type: NodeType.RPC,
      service: 'dexon.org',
      url: 'https://mainnet-rpc.dexon.org'
    }
  ],

  EGEM: [
    {
      name: makeNodeName('EGEM', 'egem'),
      type: NodeType.RPC,
      service: 'egem.io',
      url: 'https://jsonrpc.egem.io/custom'
    }
  ],

  ELLA: [
    {
      name: makeNodeName('ELLA', 'ellaism'),
      type: NodeType.RPC,
      service: 'ellaism.org',
      url: 'https://jsonrpc.ellaism.org'
    }
  ],

  EOSC: [
    {
      name: makeNodeName('EOSC', 'eosc'),
      type: NodeType.RPC,
      service: 'eos-classic.io',
      url: 'https://node.eos-classic.io/'
    }
  ],

  ESN: [
    {
      name: makeNodeName('ESN', 'esn'),
      type: NodeType.RPC,
      service: 'ethersocial.org',
      url: 'https://api.esn.gonspool.com'
    }
  ],

  ETHO: [
    {
      name: makeNodeName('ETHO', 'ether1.org'),
      type: NodeType.RPC,
      service: 'ether1.org',
      url: 'https://rpc.ether1.org'
    }
  ],

  ETSC: [
    {
      name: makeNodeName('ETSC', 'etsc'),
      type: NodeType.RPC,
      service: 'ethereumsocial.kr',
      url: 'https://node.ethereumsocial.kr'
    }
  ],

  EXP: [
    {
      name: makeNodeName('EXP', 'tech'),
      type: NodeType.RPC,
      service: 'expanse.tech',
      url: 'https://node.expanse.tech/'
    }
  ],

  Gangnam: [
    {
      name: makeNodeName('Gangnam', 'progtest'),
      type: NodeType.RPC,
      service: 'Gangnam ProgPoW',
      url: 'https://rpc.progtest.net'
    }
  ],

  GO: [
    {
      name: makeNodeName('GO', 'go'),
      type: NodeType.RPC,
      service: 'gochain.io',
      url: 'https://rpc.gochain.io/'
    }
  ],

  GO_TESTNET: [
    {
      name: makeNodeName('GO_TESTNET', 'go_testnet'),
      type: NodeType.RPC,
      service: 'testnet-rpc.gochain.io',
      url: 'https://testnet-rpc.gochain.io/'
    }
  ],

  METADIUM: [
    {
      name: makeNodeName('METADIUM', 'metadium'),
      type: NodeType.RPC,
      service: 'api.metadium.com',
      url: 'https://api.metadium.com/prod'
    }
  ],

  MIX: [
    {
      name: makeNodeName('MIX', 'mix-blockchain.org'),
      type: NodeType.RPC,
      service: 'rpc2.mix-blockchain.org',
      url: 'https://rpc2.mix-blockchain.org:8647'
    }
  ],

  MUSIC: [
    {
      name: makeNodeName('MUSIC', 'music'),
      type: NodeType.RPC,
      service: 'musicoin.tw',
      url: 'https://mewapi.musicoin.tw'
    }
  ],

  PIRL: [
    {
      name: makeNodeName('PIRL', 'wallrpc.pirl.io'),
      type: NodeType.RPC,
      service: 'wallrpc.pirl.io',
      url: 'https://wallrpc.pirl.io'
    }
  ],

  POA: [
    {
      name: makeNodeName('POA', 'core'),
      type: NodeType.INFURA,
      service: 'core.poa.network',
      url: 'https://core.poa.network'
    }
  ],

  REOSC: [
    {
      name: makeNodeName('REOSC', 'reosc.io'),
      type: NodeType.RPC,
      service: 'remote.reosc.io',
      url: 'https://remote.reosc.io:3000'
    }
  ],

  RSK_TESTNET: [
    {
      name: makeNodeName('RSK_TESTNET', 'rsk_testnet'),
      type: NodeType.RPC,
      service: 'mycrypto.testnet.rsk.co',
      url: 'https://mycrypto.testnet.rsk.co/'
    }
  ],

  SOLIDUM: [
    {
      name: makeNodeName('SOLIDUM', 'rpc.solidum.network'),
      type: NodeType.RPC,
      service: 'rpc.solidum.network',
      url: 'https://rpc.solidum.network'
    }
  ],

  THUNDERCORE: [
    {
      name: makeNodeName('THUNDERCORE', 'thundercore'),
      type: NodeType.RPC,
      service: 'thundercore.com',
      url: 'https://mainnet-rpc.thundercore.com'
    }
  ],

  ETI: [
    {
      name: makeNodeName('ETI', 'eti'),
      type: NodeType.RPC,
      service: 'api.einc.io',
      url: 'https://api.einc.io/jsonrpc/mainnet/'
    }
  ],
  TOMO: [
    {
      name: makeNodeName('TOMO', 'tomochain'),
      type: NodeType.RPC,
      service: 'tomochain.com',
      url: 'https://rpc.tomochain.com'
    }
  ],

  UBQ: [
    {
      name: makeNodeName('UBQ', 'ubiqscan'),
      type: NodeType.RPC,
      service: 'ubiqscan.io',
      url: 'https://rpc1.ubiqscan.io'
    }
  ],

  WEB: [
    {
      name: makeNodeName('WEB', 'node1.webchain.network'),
      type: NodeType.RPC,
      service: 'node1.webchain.network',
      url: 'https://node1.webchain.network'
    },
    {
      name: makeNodeName('WEB', 'node2.webchain.network'),
      type: NodeType.RPC,
      service: 'node2.webchain.network',
      url: 'https://node2.webchain.network'
    }
  ],

  AUX: [
    {
      name: makeNodeName('AUX', 'auxilium'),
      type: NodeType.RPC,
      service: 'auxilium.global',
      url: 'https://rpc.auxilium.global'
    }
  ]
};
