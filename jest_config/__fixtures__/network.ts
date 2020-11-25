import { Network, NodeType, TTicker, TUuid } from '@types';
import { makeExplorer } from '@utils';

const Ethereum: Network = {
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
      label: 'Trezor (ETH)',
      value: "m/44'/60'/0'/0"
    },
    LEDGER_NANO_S: {
      label: 'Ledger (ETH)',
      value: "m/44'/60'/0'"
    },
    default: {
      label: 'Default (ETH)',
      value: "m/44'/60'/0'/0"
    }
  },
  contracts: [],
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
  }),
  selectedNode: 'eth_mycrypto'
};

const Ropsten: Network = {
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
      label: 'Testnet (ETH)',
      value: "m/44'/1'/0'/0"
    },
    LEDGER_NANO_S: {
      label: 'Ledger (ETH)',
      value: "m/44'/60'/0'"
    },
    default: {
      label: 'Testnet (ETH)',
      value: "m/44'/1'/0'/0"
    }
  },
  contracts: [],
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

export const fNetworks = [Ethereum, Ropsten];

export const fNetwork = fNetworks[1];
