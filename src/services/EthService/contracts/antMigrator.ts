import { IAntMigrator } from '@types';

import { default as Contract } from './contract';

const ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_owner', type: 'address' },
      { internalType: 'contract IERC20', name: '_antv1', type: 'address' },
      { internalType: 'contract ANTv2', name: '_antv2', type: 'address' }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    constant: true,
    inputs: [],
    name: 'antv1',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'antv2',
    outputs: [{ internalType: 'contract ANTv2', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'initiate',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
    name: 'migrate',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'migrateAll',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: '_from', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'address', name: '_token', type: 'address' },
      { internalType: 'bytes', name: '', type: 'bytes' }
    ],
    name: 'receiveApproval',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

export const AntMigrator = (new Contract(ABI, {
  decimals: ['decimals'],
  symbol: ['symbol'],
  approve: ['approved']
}) as any) as IAntMigrator;
