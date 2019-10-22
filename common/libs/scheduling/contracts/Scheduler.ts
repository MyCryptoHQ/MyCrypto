import Contract from 'libs/contracts';
import { ABIFunc } from '../../erc20';

type address = any;
type uint256 = any;
type bytes = string | Buffer;

interface IScheduler {
  schedule: ABIFunc<{ _toAddress: address; _callData: bytes; _uintArgs: uint256[] }>;
}

const schedulerAbi = [
  {
    constant: false,
    inputs: [
      {
        name: '_toAddress',
        type: 'address'
      },
      {
        name: '_callData',
        type: 'bytes'
      },
      {
        name: '_uintArgs',
        type: 'uint256[8]'
      }
    ],
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    name: 'schedule',
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  }
];

export default (new Contract(schedulerAbi, {}) as any) as IScheduler;
