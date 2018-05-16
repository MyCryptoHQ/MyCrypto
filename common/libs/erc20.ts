import Contract from 'libs/contracts';
import { ABIFunc, ABIFuncParamless } from 'libs/ens/contracts/AbiFunc';

type uint256 = any;
type uint8 = any;

type address = any;

interface IErc20 {
  decimals: ABIFuncParamless<{ decimals: uint8 }>;
  symbol: ABIFuncParamless<{ symbol: string }>;

  balanceOf: ABIFunc<{ _owner: address }, { balance: uint256 }>;
  transfer: ABIFunc<{ _to: address; _value: uint256 }>;
}

const erc20Abi = [
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
  }
];

export default (new Contract(erc20Abi, {
  decimals: ['decimals'],
  symbol: ['symbol']
}) as any) as IErc20;
