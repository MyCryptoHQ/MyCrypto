import { REPV1UUID, REPV2UUID } from '@config';
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
      label: 'TREZOR (ETH)',
      value: "m/44'/60'/0'/0"
    },
    LEDGER_NANO_S: {
      label: 'Ledger (ETH)',
      value: "m/44'/60'/0'"
    },
    LEDGER_NANO_S_NEW: {
      label: 'Ledger (ETH)',
      value: "m/44'/60'/0'"
    },
    default: {
      label: 'Default (ETH)',
      value: "m/44'/60'/0'/0"
    }
  },
  contracts: [],
  assets: ['356a192b-7913-504c-9457-4d18c28d46e6', REPV1UUID, REPV2UUID] as TUuid[],
  baseAsset: '356a192b-7913-504c-9457-4d18c28d46e6' as TUuid,
  baseUnit: 'ETH' as TTicker,
  autoNode: 'ethereum_mycrypto',
  selectedNode: 'ethereum_mycrypto',
  nodes: [
    {
      name: 'ethereum_mycrypto',
      type: NodeType.RPC,
      service: 'MyCrypto',
      url: 'https://api.mycryptoapi.com/eth',
      isCustom: false
    },
    {
      name: 'ethereum_ethscan',
      type: NodeType.ETHERSCAN,
      service: 'Etherscan',
      url: 'https://api.etherscan.io/api',
      isCustom: false
    },
    {
      isCustom: false,
      name: 'ethereum_infura',
      service: 'Infura',
      type: NodeType.INFURA,
      url: 'https://mainnet.infura.io/v3/f3b4711ae677488bb3c56de93c6cab1a'
    },
    {
      isCustom: false,
      name: 'ethereum_pocket',
      service: 'Pocket',
      type: NodeType.POCKET,
      url: 'https://eth-mainnet.gateway.pokt.network/v1/lb/5f6a53d75053d3232349e41e'
    }
  ],
  blockExplorer: makeExplorer({
    name: 'Etherscan',
    origin: 'https://etherscan.io'
  }),
  tokenExplorer: {
    addressPath: 'address',
    blockPath: 'block',
    name: 'EthPlorer',
    origin: 'https://ethplorer.io',
    txPath: 'tx'
  },
  shouldEstimateGasPrice: true
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
  assets: [
    '77de68da-ecd8-53ba-bbb5-8edb1c8e14d7',
    'e0977bcb-30be-53cf-99d2-e5f031e8624b',
    '8fa21ab1-48ac-544a-b13c-69d86528d126',
    '3849a248-49b4-5e85-91cb-0f9f97eaa0c9',
    '528fb72f-8536-5219-8b65-20fbd0e4355d',
    '4f6380d2-303e-5fe4-8f0b-25f944e5dc84',
    '39a543b0-ac4f-5b14-9467-86fd6538a6a2'
  ] as TUuid[],
  baseAsset: '77de68da-ecd8-53ba-bbb5-8edb1c8e14d7' as TUuid,
  baseUnit: 'RopstenETH' as TTicker,
  nodes: [
    {
      name: 'ropsten_infura',
      type: NodeType.INFURA,
      service: 'Infura',
      url: 'https://ropsten.infura.io/v3/f3b4711ae677488bb3c56de93c6cab1a',
      isCustom: false
    }
  ],
  autoNode: 'ropsten_infura',
  selectedNode: 'ropsten_infura',
  blockExplorer: makeExplorer({
    name: 'Etherscan',
    origin: 'https://ropsten.etherscan.io'
  })
};

export const fNetworks = [Ethereum, Ropsten];

export const fNetwork = fNetworks[1];
