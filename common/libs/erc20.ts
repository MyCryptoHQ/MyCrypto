import Contract from 'libs/contracts';

type uint256 = any;

type address = any;

export interface ABIFunc<T, K = void> {
  outputType: K;
  decodeInput(argStr: string): T;
  encodeInput(x: T): string;
  decodeOutput(argStr: string): K;
}

export interface ABIFuncParamless<T = void> {
  outputType: T;
  encodeInput(): string;
  decodeOutput(argStr: string): T;
}

interface IErc20 {
  decimals: ABIFuncParamless<{ decimals: string }>;
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
