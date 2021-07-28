import { IERC20 } from '@types';

import { default as Contract } from './contract';

export const erc20Abi = [
  {
    name: 'decimals',
    type: 'function',

    constant: true,
    payable: false,
    inputs: [],

    outputs: [
      {
        name: '',
        type: 'uint8'
      }
    ]
  },
  {
    name: 'symbol',
    type: 'function',
    constant: true,
    payable: false,

    inputs: [],

    outputs: [
      {
        name: '',
        type: 'string'
      }
    ]
  },

  {
    name: 'balanceOf',
    type: 'function',
    constant: true,
    payable: false,

    inputs: [
      {
        name: '_owner',
        type: 'address'
      }
    ],

    outputs: [
      {
        name: 'balance',
        type: 'uint256'
      }
    ]
  },

  {
    name: 'transfer',
    type: 'function',
    constant: false,
    payable: false,

    inputs: [
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],

    outputs: [
      {
        name: 'success',
        type: 'bool'
      }
    ]
  },
  {
    name: 'transferFrom',
    type: 'function',
    constant: false,
    payable: false,

    inputs: [
      {
        name: '_from',
        type: 'address'
      },
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],

    outputs: [
      {
        name: 'success',
        type: 'bool'
      }
    ]
  },
  {
    name: 'Transfer',
    type: 'event',
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_from',
        type: 'address'
      },
      {
        indexed: true,
        name: '_to',
        type: 'address'
      },
      {
        indexed: false,
        name: '_value',
        type: 'uint256'
      }
    ]
  },
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'approve',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },

  {
    name: 'allowance',
    type: 'function',
    constant: true,
    payable: false,
    stateMutability: 'view',

    inputs: [
      {
        name: '_owner',
        type: 'address'
      },
      {
        name: '_spender',
        type: 'address'
      }
    ],

    outputs: [
      {
        name: 'allowance',
        type: 'uint256'
      }
    ]
  }
];

export const ERC20 = (new Contract(erc20Abi, {
  decimals: ['decimals'],
  symbol: ['symbol'],
  approve: ['approved']
}) as any) as IERC20;
