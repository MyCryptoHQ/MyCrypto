import { RawNodeConfig } from 'types/node';
import { StaticNetworkIds } from 'types/network';

export const makeNodeName = (network: string, name: string) => {
  return `${network.toLowerCase()}_${name}`;
};

export const NODE_CONFIGS: { [key in StaticNetworkIds]: RawNodeConfig[] } = {
  ETH: [
    {
      name: makeNodeName('ETH', 'mycrypto'),
      type: 'rpc',
      service: 'MyCrypto',
      url: 'https://api.mycryptoapi.com/eth',
      estimateGas: true
    },
    {
      name: makeNodeName('ETH', 'ethscan'),
      type: 'etherscan',
      service: 'Etherscan',
      url: 'https://api.etherscan.io/api',
      estimateGas: false
    },
    {
      name: makeNodeName('ETH', 'infura'),
      type: 'infura',
      service: 'Infura',
      url: 'https://mainnet.infura.io/mycrypto',
      estimateGas: false
    },
    {
      name: makeNodeName('ETH', 'blockscale'),
      type: 'rpc',
      service: 'Blockscale',
      url: 'https://api.dev.blockscale.net/dev/parity',
      estimateGas: true
    }
  ],

  Ropsten: [
    {
      name: makeNodeName('Ropsten', 'infura'),
      type: 'infura',
      service: 'Infura',
      url: 'https://ropsten.infura.io/mycrypto',
      estimateGas: false
    }
  ],

  Kovan: [
    {
      name: makeNodeName('Kovan', 'ethscan'),
      type: 'etherscan',
      service: 'Etherscan',
      url: 'https://kovan.etherscan.io/api',
      estimateGas: false
    }
  ],

  Rinkeby: [
    {
      name: makeNodeName('Rinkeby', 'infura'),
      type: 'infura',
      service: 'Infura',
      url: 'https://rinkeby.infura.io/mycrypto',
      estimateGas: false
    },
    {
      name: makeNodeName('Rinkeby', 'ethscan'),
      type: 'etherscan',
      service: 'Etherscan',
      url: 'https://rinkeby.etherscan.io/api',
      estimateGas: false
    }
  ],

  ETC: [
    {
      name: makeNodeName('ETC', 'epool'),
      type: 'rpc',
      service: 'Epool.io',
      url: 'https://mew.epool.io',
      estimateGas: false
    },
    {
      name: makeNodeName('ETC', 'commonwealth'),
      type: 'rpc',
      service: 'Ethereum Commonwealth',
      url: 'https://etc-geth.0xinfra.com/',
      estimateGas: false
    }
  ],

  UBQ: [
    {
      name: makeNodeName('UBQ', 'ubiqscan'),
      type: 'rpc',
      service: 'ubiqscan.io',
      url: 'https://pyrus2.ubiqscan.io',
      estimateGas: true
    }
  ],

  EXP: [
    {
      name: makeNodeName('EXP', 'tech'),
      type: 'rpc',
      service: 'expanse.tech',
      url: 'https://node.expanse.tech/',
      estimateGas: true
    }
  ],
  POA: [
    {
      name: makeNodeName('POA', 'core'),
      type: 'rpc',
      service: 'poa.network',
      url: 'https://core.poa.network',
      estimateGas: true
    }
  ],

  TOMO: [
    {
      name: makeNodeName('TOMO', 'tomocoin'),
      type: 'rpc',
      service: 'tomocoin.io',
      url: 'https://core.tomocoin.io',
      estimateGas: true
    }
  ],

  ELLA: [
    {
      name: makeNodeName('ELLA', 'ellaism'),
      type: 'rpc',
      service: 'ellaism.org',
      url: 'https://jsonrpc.ellaism.org',
      estimateGas: true
    }
  ]
};

export default NODE_CONFIGS;
