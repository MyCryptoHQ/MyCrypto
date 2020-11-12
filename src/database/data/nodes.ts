import { INFURA_API_KEY, POCKET_API_KEY } from '@config';
import { NetworkUtils } from '@services/Store/Network';
import { NetworkId, NodeType, StaticNodeConfig } from '@types';

export const NODES_CONFIG: Record<NetworkId, StaticNodeConfig[]> = {
  Ethereum: [
    {
      name: NetworkUtils.makeNodeName('Ethereum', 'mycrypto'),
      type: NodeType.RPC,
      service: 'MyCrypto',
      url: 'https://api.mycryptoapi.com/eth',
      isCustom: false
    },
    {
      name: NetworkUtils.makeNodeName('Ethereum', 'ethscan'),
      type: NodeType.ETHERSCAN,
      service: 'Etherscan',
      url: 'https://api.etherscan.io/api',
      isCustom: false
    },
    {
      name: NetworkUtils.makeNodeName('Ethereum', 'infura'),
      type: NodeType.INFURA,
      service: 'Infura',
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      isCustom: false
    },
    {
      name: NetworkUtils.makeNodeName('Ethereum', 'pocket'),
      type: NodeType.POCKET,
      service: 'Pocket',
      url: `https://eth-mainnet.gateway.pokt.network/v1/lb/${POCKET_API_KEY}`,
      isCustom: false
    }
  ],

  Ropsten: [
    {
      name: NetworkUtils.makeNodeName('Ropsten', 'infura'),
      type: NodeType.INFURA,
      service: 'Infura',
      url: `https://ropsten.infura.io/v3/${INFURA_API_KEY}`,
      isCustom: false
    }
  ],

  Kovan: [
    {
      name: NetworkUtils.makeNodeName('Kovan', 'ethscan'),
      type: NodeType.ETHERSCAN,
      service: 'Etherscan',
      url: 'https://kovan.etherscan.io/api',
      isCustom: false
    }
  ],

  Rinkeby: [
    {
      name: NetworkUtils.makeNodeName('Rinkeby', 'infura'),
      type: NodeType.INFURA,
      service: 'Infura',
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      isCustom: false
    },
    {
      name: NetworkUtils.makeNodeName('Rinkeby', 'ethscan'),
      type: NodeType.ETHERSCAN,
      service: 'Etherscan',
      url: 'https://rinkeby.etherscan.io/api',
      isCustom: false
    }
  ],

  Goerli: [
    {
      name: NetworkUtils.makeNodeName('Goerli', 'mycrypto'),
      type: NodeType.RPC,
      service: 'MyCrypto',
      url: 'https://goerli.mycryptoapi.com',
      isCustom: false
    },
    {
      name: NetworkUtils.makeNodeName('Goerli', 'etherscan'),
      type: NodeType.ETHERSCAN,
      service: 'Etherscan',
      url: 'https://api-goerli.etherscan.io/api',
      isCustom: false
    }
  ],

  ETC: [
    {
      name: NetworkUtils.makeNodeName('ETC', 'etccooperative'),
      type: NodeType.RPC,
      service: 'ETC Cooperative',
      url: 'https://www.ethercluster.com/etc',
      isCustom: false
    }
  ],

  RSK: [
    {
      name: NetworkUtils.makeNodeName('RSK', 'rsk_mainnet'),
      type: NodeType.RPC,
      service: 'mycrypto.rsk.co',
      url: 'https://mycrypto.rsk.co/',
      isCustom: false
    }
  ],

  AKA: [
    {
      name: NetworkUtils.makeNodeName('AKA', 'remote.akroma.io'),
      type: NodeType.RPC,
      service: 'remote.akroma.io',
      url: 'https://remote.akroma.io',
      isCustom: false
    }
  ],

  AQUA: [
    {
      name: NetworkUtils.makeNodeName('AQUA', 'uncan.onical'),
      type: NodeType.RPC,
      service: 'c.onical.org',
      url: 'https://c.onical.org',
      isCustom: false
    }
  ],

  ASK: [
    {
      name: NetworkUtils.makeNodeName('ASK', 'permission'),
      type: NodeType.RPC,
      service: 'permission.io',
      url: 'https://blockchain-api-mainnet.permission.io/rpc',
      isCustom: false
    }
  ],

  ARTIS_SIGMA1: [
    {
      name: NetworkUtils.makeNodeName('ARTIS_SIGMA1', 'artis_sigma1'),
      type: NodeType.RPC,
      service: 'rpc.sigma1.artis.network',
      url: 'https://rpc.sigma1.artis.network',
      isCustom: false
    }
  ],

  ARTIS_TAU1: [
    {
      name: NetworkUtils.makeNodeName('ARTIS_TAU1', 'artis_tau1'),
      type: NodeType.RPC,
      service: 'rpc.tau1.artis.network',
      url: 'https://rpc.tau1.artis.network',
      isCustom: false
    }
  ],

  ATH: [
    {
      name: NetworkUtils.makeNodeName('ATH', 'rpc.atheios.org'),
      type: NodeType.RPC,
      service: 'rpc.atheios.org',
      url: 'https://rpc.atheios.org/',
      isCustom: false
    }
  ],

  CLO: [
    {
      name: NetworkUtils.makeNodeName('CLO', 'clo'),
      type: NodeType.RPC,
      service: '0xinfra.com',
      url: 'https://clo-geth.0xinfra.com/',
      isCustom: false
    }
  ],

  DEXON: [
    {
      name: NetworkUtils.makeNodeName('DEXON', 'dexon'),
      type: NodeType.RPC,
      service: 'dexon.org',
      url: 'https://mainnet-rpc.dexon.org',
      isCustom: false
    }
  ],

  EGEM: [
    {
      name: NetworkUtils.makeNodeName('EGEM', 'egem'),
      type: NodeType.RPC,
      service: 'egem.io',
      url: 'https://jsonrpc.egem.io/custom',
      isCustom: false
    }
  ],

  ESN: [
    {
      name: NetworkUtils.makeNodeName('ESN', 'esn'),
      type: NodeType.RPC,
      service: 'ethersocial.org',
      url: 'https://api.esn.gonspool.com',
      isCustom: false
    }
  ],

  ETHO: [
    {
      name: NetworkUtils.makeNodeName('ETHO', 'ether1.org'),
      type: NodeType.RPC,
      service: 'ether1.org',
      url: 'https://rpc.ether1.org',
      isCustom: false
    }
  ],

  EXP: [
    {
      name: NetworkUtils.makeNodeName('EXP', 'tech'),
      type: NodeType.RPC,
      service: 'expanse.tech',
      url: 'https://node.expanse.tech/',
      isCustom: false
    }
  ],

  GO: [
    {
      name: NetworkUtils.makeNodeName('GO', 'go'),
      type: NodeType.RPC,
      service: 'gochain.io',
      url: 'https://rpc.gochain.io/',
      isCustom: false
    }
  ],

  GO_TESTNET: [
    {
      name: NetworkUtils.makeNodeName('GO_TESTNET', 'go_testnet'),
      type: NodeType.RPC,
      service: 'testnet-rpc.gochain.io',
      url: 'https://testnet-rpc.gochain.io/',
      isCustom: false
    }
  ],

  METADIUM: [
    {
      name: NetworkUtils.makeNodeName('METADIUM', 'metadium'),
      type: NodeType.RPC,
      service: 'api.metadium.com',
      url: 'https://api.metadium.com/prod',
      isCustom: false
    }
  ],

  MIX: [
    {
      name: NetworkUtils.makeNodeName('MIX', 'mix-blockchain.org'),
      type: NodeType.RPC,
      service: 'rpc2.mix-blockchain.org',
      url: 'https://rpc2.mix-blockchain.org:8647',
      isCustom: false
    }
  ],

  MUSIC: [
    {
      name: NetworkUtils.makeNodeName('MUSIC', 'music'),
      type: NodeType.RPC,
      service: 'rpc.musicoin.org',
      url: 'https://rpc.musicoin.org/',
      isCustom: false
    }
  ],

  PIRL: [
    {
      name: NetworkUtils.makeNodeName('PIRL', 'wallrpc.pirl.io'),
      type: NodeType.RPC,
      service: 'wallrpc.pirl.io',
      url: 'https://wallrpc.pirl.io',
      isCustom: false
    }
  ],

  POA: [
    {
      name: NetworkUtils.makeNodeName('POA', 'core'),
      type: NodeType.INFURA,
      service: 'core.poa.network',
      url: 'https://core.poa.network',
      isCustom: false
    }
  ],

  REOSC: [
    {
      name: NetworkUtils.makeNodeName('REOSC', 'reosc.io'),
      type: NodeType.RPC,
      service: 'remote.reosc.io',
      url: 'https://remote.reosc.io:3000',
      isCustom: false
    }
  ],

  RSK_TESTNET: [
    {
      name: NetworkUtils.makeNodeName('RSK_TESTNET', 'rsk_testnet'),
      type: NodeType.RPC,
      service: 'mycrypto.testnet.rsk.co',
      url: 'https://mycrypto.testnet.rsk.co/',
      isCustom: false
    }
  ],

  THUNDERCORE: [
    {
      name: NetworkUtils.makeNodeName('THUNDERCORE', 'thundercore'),
      type: NodeType.RPC,
      service: 'thundercore.com',
      url: 'https://mainnet-rpc.thundercore.com',
      isCustom: false
    }
  ],

  ETI: [
    {
      name: NetworkUtils.makeNodeName('ETI', 'eti'),
      type: NodeType.RPC,
      service: 'api.einc.io',
      url: 'https://api.einc.io/jsonrpc/mainnet/',
      isCustom: false
    }
  ],
  TOMO: [
    {
      name: NetworkUtils.makeNodeName('TOMO', 'tomochain'),
      type: NodeType.RPC,
      service: 'tomochain.com',
      url: 'https://rpc.tomochain.com',
      isCustom: false
    }
  ],

  UBQ: [
    {
      name: NetworkUtils.makeNodeName('UBQ', 'ubiqscan'),
      type: NodeType.RPC,
      service: 'ubiqscan.io',
      url: 'https://rpc1.ubiqscan.io',
      isCustom: false
    }
  ],

  WEB: [
    {
      name: NetworkUtils.makeNodeName('WEB', 'node1.webchain.network'),
      type: NodeType.RPC,
      service: 'node1.webchain.network',
      url: 'https://node1.webchain.network',
      isCustom: false
    },
    {
      name: NetworkUtils.makeNodeName('WEB', 'node2.webchain.network'),
      type: NodeType.RPC,
      service: 'node2.webchain.network',
      url: 'https://node2.webchain.network',
      isCustom: false
    }
  ],

  AUX: [
    {
      name: NetworkUtils.makeNodeName('AUX', 'auxilium'),
      type: NodeType.RPC,
      service: 'auxilium.global',
      url: 'https://rpc.auxilium.global',
      isCustom: false
    }
  ],

  ERE: [
    {
      name: NetworkUtils.makeNodeName('ERE', 'ethercore'),
      type: NodeType.RPC,
      service: 'ethercore.io',
      url: 'https://rpc.ethercore.io',
      isCustom: false
    }
  ],

  VOLTA: [
    {
      name: NetworkUtils.makeNodeName('VOLTA', 'volta-rpc.energyweb.org'),
      type: NodeType.RPC,
      service: 'energyweb.org',
      url: 'https://volta-rpc.energyweb.org',
      isCustom: false
    }
  ],

  EnergyWebChain: [
    {
      name: NetworkUtils.makeNodeName('EnergyWebChain', 'rpc.energyweb.org'),
      type: NodeType.RPC,
      service: 'energyweb.org',
      url: 'https://rpc.energyweb.org',
      isCustom: false
    }
  ],
  HARDLYDIFFICULT: [
    {
      name: NetworkUtils.makeNodeName('HARDLYDIFFICULT', 'ethscan'),
      type: NodeType.ETHERSCAN,
      service: 'Etherscan',
      url: 'https://api.etherscan.io/api',
      isCustom: false
    }
  ]
};
