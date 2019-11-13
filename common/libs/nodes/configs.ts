import { StaticNetworkIds } from 'types/network';
import { RawNodeConfig } from 'types/node';

export const makeNodeName = (network: string, name: string) => {
  return `${network.toLowerCase()}_${name}`;
};

export const NODE_CONFIGS: { [key in StaticNetworkIds]: RawNodeConfig[] } = {
  ETH: [
    {
      name: makeNodeName('ETH', 'mycrypto'),
      type: 'rpc',
      service: 'MyCrypto',
      url: 'https://api.mycryptoapi.com/eth'
    },
    {
      name: makeNodeName('ETH', 'ethscan'),
      type: 'etherscan',
      service: 'Etherscan',
      url: 'https://api.etherscan.io/api'
    },
    {
      name: makeNodeName('ETH', 'infura'),
      type: 'infura',
      service: 'Infura',
      url: 'https://mainnet.infura.io/v3/c02fff6b5daa434d8422b8ece54c7286'
    }
  ],

  Ropsten: [
    {
      name: makeNodeName('Ropsten', 'infura'),
      type: 'infura',
      service: 'Infura',
      url: 'https://ropsten.infura.io/v3/c02fff6b5daa434d8422b8ece54c7286'
    }
  ],

  Kovan: [
    {
      name: makeNodeName('Kovan', 'ethscan'),
      type: 'etherscan',
      service: 'Etherscan',
      url: 'https://kovan.etherscan.io/api'
    }
  ],

  Rinkeby: [
    {
      name: makeNodeName('Rinkeby', 'infura'),
      type: 'infura',
      service: 'Infura',
      url: 'https://rinkeby.infura.io/v3/c02fff6b5daa434d8422b8ece54c7286'
    },
    {
      name: makeNodeName('Rinkeby', 'ethscan'),
      type: 'etherscan',
      service: 'Etherscan',
      url: 'https://rinkeby.etherscan.io/api'
    }
  ],

  Goerli: [
    {
      name: makeNodeName('Goerli', 'mycrypto'),
      type: 'rpc',
      service: 'MyCrypto',
      url: 'https://goerli.mycryptoapi.com'
    },
    {
      name: makeNodeName('Goerli', 'etherscan'),
      type: 'etherscan',
      service: 'Etherscan',
      url: 'https://api-goerli.etherscan.io/api'
    }
  ],

  ETC: [
    {
      name: makeNodeName('ETC', 'etccooperative'),
      type: 'rpc',
      service: 'ETC Cooperative',
      url: 'https://ethereumclassic.network'
    }
  ],

  RSK: [
    {
      name: makeNodeName('RSK', 'rsk_mainnet'),
      type: 'rpc',
      service: 'mycrypto.rsk.co',
      url: 'https://mycrypto.rsk.co/'
    }
  ],

  AKA: [
    {
      name: makeNodeName('AKA', 'remote.akroma.io'),
      type: 'rpc',
      service: 'remote.akroma.io',
      url: 'https://remote.akroma.io'
    },
    {
      name: makeNodeName('AKA', 'rpc.akroma.io'),
      type: 'rpc',
      service: 'rpc.akroma.io',
      url: 'https://rpc.akroma.io'
    }
  ],

  AQUA: [
    {
      name: makeNodeName('AQUA', 'aquachain'),
      type: 'rpc',
      service: 'aquacha.in',
      url: 'https://tx.aquacha.in/api'
    },
    {
      name: makeNodeName('AQUA', 'uncan.onical'),
      type: 'rpc',
      service: 'uncan.onical.org',
      url: 'https://c.onical.org'
    }
  ],

  ASK: [
    {
      name: makeNodeName('ASK', 'permission'),
      type: 'rpc',
      service: 'permission.io',
      url: 'https://blockchain-api-mainnet.permission.io/rpc'
    }
  ],

  ARTIS_SIGMA1: [
    {
      name: makeNodeName('ARTIS_SIGMA1', 'artis_sigma1'),
      type: 'rpc',
      service: 'rpc.sigma1.artis.network',
      url: 'https://rpc.sigma1.artis.network'
    }
  ],

  ARTIS_TAU1: [
    {
      name: makeNodeName('ARTIS_TAU1', 'artis_tau1'),
      type: 'rpc',
      service: 'rpc.tau1.artis.network',
      url: 'https://rpc.tau1.artis.network'
    }
  ],

  ATH: [
    {
      name: makeNodeName('ATH', 'wallet.atheios.com'),
      type: 'rpc',
      service: 'wallet.atheios.com',
      url: 'https://wallet.atheios.com:8797'
    }
  ],

  CLO: [
    {
      name: makeNodeName('CLO', 'clo'),
      type: 'rpc',
      service: '0xinfra.com',
      url: 'https://clo-geth.0xinfra.com/'
    },
    {
      name: makeNodeName('CLO', 'chainkorea'),
      type: 'rpc',
      service: 'Chainkorea',
      url: 'https://node.clopool.net/'
    }
  ],

  DEXON: [
    {
      name: makeNodeName('DEXON', 'dexon'),
      type: 'rpc',
      service: 'dexon.org',
      url: 'https://mainnet-rpc.dexon.org'
    }
  ],

  EGEM: [
    {
      name: makeNodeName('EGEM', 'egem'),
      type: 'rpc',
      service: 'egem.io',
      url: 'https://lb.rpc.egem.io'
    }
  ],

  ELLA: [
    {
      name: makeNodeName('ELLA', 'ellaism'),
      type: 'rpc',
      service: 'ellaism.org',
      url: 'https://jsonrpc.ellaism.org'
    }
  ],

  EOSC: [
    {
      name: makeNodeName('EOSC', 'eosc'),
      type: 'rpc',
      service: 'eos-classic.io',
      url: 'https://node.eos-classic.io/'
    }
  ],

  ESN: [
    {
      name: makeNodeName('ESN', 'esn'),
      type: 'rpc',
      service: 'ethersocial.org',
      url: 'https://api.esn.gonspool.com'
    }
  ],

  ETHO: [
    {
      name: makeNodeName('ETHO', 'ether1.org'),
      type: 'rpc',
      service: 'ether1.org',
      url: 'https://rpc.ether1.org'
    }
  ],

  ETSC: [
    {
      name: makeNodeName('ETSC', 'etsc'),
      type: 'rpc',
      service: 'ethereumsocial.kr',
      url: 'https://node.ethereumsocial.kr'
    }
  ],

  EXP: [
    {
      name: makeNodeName('EXP', 'tech'),
      type: 'rpc',
      service: 'expanse.tech',
      url: 'https://node.expanse.tech/'
    }
  ],

  Gangnam: [
    {
      name: makeNodeName('Gangnam', 'progtest'),
      type: 'rpc',
      service: 'Gangnam ProgPoW',
      url: 'https://rpc.progtest.net'
    }
  ],

  GO: [
    {
      name: makeNodeName('GO', 'go'),
      type: 'rpc',
      service: 'gochain.io',
      url: 'https://rpc.gochain.io/'
    }
  ],

  GO_TESTNET: [
    {
      name: makeNodeName('GO_TESTNET', 'go_testnet'),
      type: 'rpc',
      service: 'testnet-rpc.gochain.io',
      url: 'https://testnet-rpc.gochain.io/'
    }
  ],

  METADIUM: [
    {
      name: makeNodeName('METADIUM', 'metadium'),
      type: 'rpc',
      service: 'api.metadium.com',
      url: 'https://api.metadium.com/prod'
    }
  ],

  MIX: [
    {
      name: makeNodeName('MIX', 'mix-blockchain.org'),
      type: 'rpc',
      service: 'rpc2.mix-blockchain.org',
      url: 'https://rpc2.mix-blockchain.org:8647'
    }
  ],

  MUSIC: [
    {
      name: makeNodeName('MUSIC', 'music'),
      type: 'rpc',
      service: 'musicoin.tw',
      url: 'https://mewapi.musicoin.tw'
    }
  ],

  PIRL: [
    {
      name: makeNodeName('PIRL', 'wallrpc.pirl.io'),
      type: 'rpc',
      service: 'wallrpc.pirl.io',
      url: 'https://wallrpc.pirl.io'
    }
  ],

  POA: [
    {
      name: makeNodeName('POA', 'core'),
      type: 'infura',
      service: 'core.poa.network',
      url: 'https://core.poa.network'
    }
  ],

  REOSC: [
    {
      name: makeNodeName('REOSC', 'reosc.io'),
      type: 'rpc',
      service: 'remote.reosc.io',
      url: 'https://remote.reosc.io:3000'
    }
  ],

  RSK_TESTNET: [
    {
      name: makeNodeName('RSK_TESTNET', 'rsk_testnet'),
      type: 'rpc',
      service: 'mycrypto.testnet.rsk.co',
      url: 'https://mycrypto.testnet.rsk.co/'
    }
  ],

  SOLIDUM: [
    {
      name: makeNodeName('SOLIDUM', 'rpc.solidum.network'),
      type: 'rpc',
      service: 'rpc.solidum.network',
      url: 'https://rpc.solidum.network'
    }
  ],

  THUNDERCORE: [
    {
      name: makeNodeName('THUNDERCORE', 'thundercore'),
      type: 'rpc',
      service: 'thundercore.com',
      url: 'https://mainnet-rpc.thundercore.com'
    }
  ],

  ETI: [
    {
      name: makeNodeName('ETI', 'eti'),
      type: 'rpc',
      service: 'api.einc.io',
      url: 'https://api.einc.io/jsonrpc/mainnet/'
    }
  ],
  TOMO: [
    {
      name: makeNodeName('TOMO', 'tomochain'),
      type: 'rpc',
      service: 'tomochain.com',
      url: 'https://rpc.tomochain.com'
    }
  ],

  UBQ: [
    {
      name: makeNodeName('UBQ', 'ubiqscan'),
      type: 'rpc',
      service: 'ubiqscan.io',
      url: 'https://rpc1.ubiqscan.io'
    }
  ],

  WEB: [
    {
      name: makeNodeName('WEB', 'node1.webchain.network'),
      type: 'rpc',
      service: 'node1.webchain.network',
      url: 'https://node1.webchain.network'
    },
    {
      name: makeNodeName('WEB', 'node2.webchain.network'),
      type: 'rpc',
      service: 'node2.webchain.network',
      url: 'https://node2.webchain.network'
    }
  ],

  AUX: [
    {
      name: makeNodeName('AUX', 'auxilium'),
      type: 'rpc',
      service: 'auxilium.global',
      url: 'https://rpc.auxilium.global'
    }
  ]
};

export default NODE_CONFIGS;
