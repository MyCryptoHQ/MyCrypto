import Contract from 'libs/contracts';

interface ABIFunc<T, K = void> {
  encodeInput(x: T): string;
  decodeInput(argStr: string): T;
  decodeOutput(argStr: string): K;
}

type address = any;
type uint256 = any;

interface IErc20 {
  balanceOf: ABIFunc<{ _owner: address }, { balance: uint256 }>;
  transfer: ABIFunc<{ _to: address; _value: uint256 }>;
}

const erc20Abi = [
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
  }
];

export default (new Contract(erc20Abi) as any) as IErc20;
