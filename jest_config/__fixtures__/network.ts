import { XDAIUUID } from '@config';
import { Network, NodeType, TTicker, TUuid } from '@types';
import { makeExplorer } from '@utils';

export const Ethereum: Network = {
  id: 'Ethereum',
  name: 'Ethereum',
  chainId: 1,
  isCustom: false,
  isTestnet: false,
  color: '#007896',
  gasPriceSettings: {
    min: 1,
    max: 60,
    initial: 20
  },
  dPaths: {
    TREZOR: {
      name: 'Trezor (ETH)',
      path: "m/44'/60'/0'/0/<account>"
    },
    LEDGER_NANO_S: {
      name: 'Ledger (ETH)',
      path: "m/44'/60'/0'/<account>"
    },
    default: {
      name: 'Default (ETH)',
      path: "m/44'/60'/0'/0/<account>"
    }
  },
  baseAsset: '356a192b-7913-504c-9457-4d18c28d46e6' as TUuid,
  baseUnit: 'ETH' as TTicker,
  nodes: [
    {
      name: 'eth_mycrypto',
      type: NodeType.RPC,
      service: 'MyCrypto',
      url: 'https://api.mycryptoapi.com/eth'
    },
    {
      name: 'eth_ethscan',
      type: NodeType.ETHERSCAN,
      service: 'Etherscan',
      url: 'https://api.etherscan.io/api'
    }
  ],
  blockExplorer: makeExplorer({
    name: 'Etherscan',
    origin: 'https://etherscan.io'
  })
};

export const Ropsten: Network = {
  id: 'Ropsten',
  name: 'Ropsten',
  chainId: 3,
  isCustom: false,
  isTestnet: true,
  color: '#adc101',
  gasPriceSettings: {
    min: 0.1,
    max: 40,
    initial: 4
  },
  dPaths: {
    TREZOR: {
      name: 'Testnet (ETH)',
      path: "m/44'/1'/0'/0/<account>"
    },
    LEDGER_NANO_S: {
      name: 'Ledger (ETH)',
      path: "m/44'/60'/0'/<account>"
    },
    default: {
      name: 'Testnet (ETH)',
      path: "m/44'/1'/0'/0/<account>"
    }
  },
  baseAsset: '77de68da-ecd8-53ba-bbb5-8edb1c8e14d7' as TUuid,
  baseUnit: 'RopstenETH' as TTicker,
  nodes: [
    {
      name: 'ropsten_infura',
      type: NodeType.INFURA,
      service: 'Infura',
      url: 'https://ropsten.infura.io/v3/c02fff6b5daa434d8422b8ece54c7286'
    }
  ],
  blockExplorer: makeExplorer({
    name: 'Etherscan',
    origin: 'https://ropsten.etherscan.io'
  })
};

export const xDAI: Network = {
  id: 'xDAI',
  name: 'xDAI',
  chainId: 100,
  isCustom: false,
  color: '#15bba6',
  blockExplorer: makeExplorer({
    name: 'xDai',
    origin: 'https://blockscout.com/poa/xdai',
    addressPath: 'address',
    blockPath: 'blocks'
  }),
  dPaths: {
    TREZOR: {
      name: 'Trezor (XDAI)',
      path: "m/44'/700'/0'/0/<account>"
    },
    LEDGER_NANO_S: {
      name: 'Ledger (ETH)',
      path: "m/44'/60'/0'/<account>"
    },
    default: {
      name: 'Default (XDAI)',
      path: "m/44'/700'/0'/0/<account>"
    }
  },
  gasPriceSettings: {
    min: 0.01,
    max: 30,
    initial: 1
  },
  shouldEstimateGasPrice: false,
  baseAsset: XDAIUUID as TUuid,
  baseUnit: 'xDAI' as TTicker,
  nodes: [
    {
      name: 'Blockscout',
      type: NodeType.RPC,
      service: 'Blockscout',
      url: 'https://blockscout.com/poa/xdai'
    }
  ]
};

export const fNetworks = [Ethereum, Ropsten, xDAI];

export const fNetwork = fNetworks[1];
