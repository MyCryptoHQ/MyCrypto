import Big, { BigNumber } from 'bignumber.js';
import { toChecksumAddress } from 'ethereumjs-util';
import Contract, { ABI } from 'libs/contract';

interface Transfer {
  to: string;
  value: string;
}

const erc20Abi: ABI = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256'
      }
    ],
    payable: false,
    type: 'function'
  },
  {
    constant: false,
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
    name: 'transfer',
    outputs: [
      {
        name: 'success',
        type: 'bool'
      }
    ],
    payable: false,
    type: 'function'
  }
];

class ERC20 extends Contract {
  constructor() {
    super(erc20Abi);
  }

  public balanceOf(address: string): string {
    return this.call('balanceOf', [address]);
  }

  public transfer(to: string, value: BigNumber): string {
    return this.call('transfer', [to, value.toString()]);
  }

  public $transfer(data: string): Transfer {
    const decodedArgs = this.decodeArgs(this.getMethodAbi('transfer'), data);
    return {
      to: toChecksumAddress(`0x${decodedArgs[0].toString(16)}`),
      value: decodedArgs[1].toString(10)
    };
  }
}

export default new ERC20();
